import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings
from loguru import logger
from app.models.extended_schemas import CaseCardResponse, CaseStep

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

class CaseCardService:
    def __init__(self):
        self._supabase: Optional[Client] = None

    def _load_supabase(self) -> Optional[Client]:
        if self._supabase is None:
            if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and Client:
                self._supabase = create_client(
                    settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
                )
        return self._supabase

    async def generate_card(self, summary: str, law: str, steps: List[Dict[str, Any]], user_name: Optional[str] = None) -> CaseCardResponse:
        supabase = self._load_supabase()
        
        # Simple auto-title generation: first 5-8 words + " Analysis"
        words = summary.split()
        title_base = " ".join(words[:6])
        case_title = f"{title_base}..." if len(words) > 6 else title_base
        
        card_id = uuid.uuid4()
        share_link = f"/case/{card_id}"
        
        # Clean sections (assume law string is comma separated or a single string)
        sections = [s.strip() for s in law.split(",")]
        
        card_data = {
            "id": str(card_id),
            "case_summary": summary,
            "case_title": case_title,
            "applicable_sections": sections,
            "key_steps": steps,
            "user_name": user_name,
            "shareable_link": share_link
        }
        
        if supabase:
            try:
                supabase.table("case_cards").insert(card_data).execute()
            except Exception as e:
                logger.error(f"Error storing case card: {e}")
                # We still return the response even if DB fails for this mock/demo, 
                # but in production we'd raise an error.
        
        return CaseCardResponse(
            unique_card_id=card_id,
            case_title=case_title,
            applicable_sections=sections,
            key_steps=[CaseStep(**s) for s in steps],
            created_at=datetime.now(),
            shareable_link=share_link
        )

    async def get_card(self, card_id: str) -> Optional[Dict[str, Any]]:
        supabase = self._load_supabase()
        if not supabase:
            return None
        
        try:
            response = supabase.table("case_cards").select("*").eq("id", card_id).execute()
            if response.data:
                return response.data[0]
        except Exception as e:
            logger.error(f"Error fetching case card: {e}")
        
        return None
