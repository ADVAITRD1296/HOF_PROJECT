import json
from typing import List, Dict, Any, Optional
from app.services.rag_service import RAGService
from app.core.extended_prompts import CASE_DURATION_ESTIMATION_PROMPT
from app.models.extended_schemas import DurationResponse
from loguru import logger

class DurationService:
    def __init__(self):
        self.rag_service = RAGService()

    async def estimate_duration(self, case_type: str, court_level: str, 
                                complexity: str, jurisdiction: Optional[str] = None) -> DurationResponse:
        
        # Load LLM client
        groq_client = self.rag_service._load_groq_client()
        if not groq_client:
            raise Exception("LLM client not available")
            
        prompt = CASE_DURATION_ESTIMATION_PROMPT.format(
            case_type=case_type,
            court_level=court_level,
            complexity=complexity,
            jurisdiction=jurisdiction or "Not specified (General Indian Benchmark)"
        )
        
        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            ai_data = json.loads(chat_completion.choices[0].message.content)
            
            return DurationResponse(
                estimated_months_min=ai_data.get("estimated_months_min", 12),
                estimated_months_max=ai_data.get("estimated_months_max", 36),
                confidence_score=ai_data.get("confidence_score", 70),
                factors_considered=ai_data.get("factors_considered", ["Case Type", "Judicial Backlog"]),
                bottlenecks=ai_data.get("bottlenecks", ["Procedural Delays", "High Pendency"]),
                optimizations=ai_data.get("optimizations", ["Pre-litigation Mediation", "Lok Adalat Referral"]),
                precedent_basis=ai_data.get("precedent_basis", "Estimate based on average Indian court disposal rates.")
            )
            
        except Exception as e:
            logger.error(f"Error calling LLM for duration estimation: {e}")
            return DurationResponse(
                estimated_months_min=12,
                estimated_months_max=48,
                confidence_score=50,
                factors_considered=["System analysis failed. Using historical conservative estimates."],
                bottlenecks=["Internal System Error", "AI Timeout"],
                optimizations=["Try again later"],
                precedent_basis="Calculated via fallback judicial heuristics."
            )
