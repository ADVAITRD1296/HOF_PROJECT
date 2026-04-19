import json
from typing import List, Dict, Any
from app.services.rag_service import RAGService
from app.core.extended_prompts import CASE_STRENGTH_ANALYSIS_PROMPT
from app.models.extended_schemas import StrengthResponse
from loguru import logger

class StrengthService:
    def __init__(self):
        self.rag_service = RAGService()

    async def analyze_strength(self, case_description: str, evidence_list: List[str], 
                               witnesses: bool, documentation: bool, case_type: str) -> StrengthResponse:
        
        # 1. Retrieve legal context using existing RAG logic
        context = await self.rag_service._retrieve_hybrid_context(case_description)
        
        # 2. Get Legal Merit Score from LLM
        groq_client = self.rag_service._load_groq_client()
        if not groq_client:
            raise Exception("LLM client not available")
            
        prompt = CASE_STRENGTH_ANALYSIS_PROMPT.format(
            case_description=case_description,
            case_type=case_type,
            evidence_list=", ".join(evidence_list),
            witnesses="Yes" if witnesses else "No",
            documentation="Yes" if documentation else "No",
            context=context
        )
        
        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            
            ai_data = json.loads(chat_completion.choices[0].message.content)
            legal_merit_score = ai_data.get("legal_merit_score", 50)
            missing_elements = ai_data.get("missing_elements", [])
            ai_recommendation = ai_data.get("recommendation", "Consider legal consultation.")
        except Exception as e:
            logger.error(f"Error calling LLM for strength analysis: {e}")
            legal_merit_score = 50
            missing_elements = ["Legal merit analysis failed. Please consult a lawyer."]
            ai_recommendation = "Error in analysis pipeline. Manual review required."

        # 3. Calculate other scores based on inputs
        evidence_score = min(100, len(evidence_list) * 20) if evidence_list else 0
        documentation_score = 90 if documentation else 20
        witness_score = 80 if witnesses else 30
        
        # 4. Overall Weighted Score
        # legal_merit=40%, evidence=30%, documentation=20%, witness=10%
        overall_score = (
            (legal_merit_score * 0.4) + 
            (evidence_score * 0.3) + 
            (documentation_score * 0.2) + 
            (witness_score * 0.1)
        )
        overall_score = round(overall_score)
        
        # 5. Determine Label
        if overall_score >= 80:
            label = "Strong"
        elif overall_score >= 60:
            label = "Moderate"
        elif overall_score >= 40:
            label = "Weak"
        else:
            label = "Very Weak"
            
        return StrengthResponse(
            evidence_score=evidence_score,
            documentation_score=documentation_score,
            witness_score=witness_score,
            legal_merit_score=legal_merit_score,
            overall_strength_score=overall_score,
            strength_label=label,
            missing_elements=missing_elements,
            recommendation=ai_recommendation
        )
