from typing import List, Optional
from loguru import logger
from supabase import create_client, Client
from app.core.config import settings

class CaseService:
    def __init__(self):
        self._supabase: Optional[Client] = None
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
            self._supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    async def create_case(self, user_id: str, title: str, description: str, metadata: dict = None) -> dict:
        """Creates a new case for a user."""
        try:
            data = {
                "user_id": user_id,
                "title": title,
                "description": description,
                "status": "Active",
                "metadata": metadata or {}
            }
            response = self._supabase.table("cases").insert(data).execute()
            if not response.data:
                raise Exception("Failed to insert case")
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating case: {e}")
            raise e

    async def get_user_cases(self, user_id: str) -> List[dict]:
        """Fetches all cases for a specific user."""
        try:
            response = self._supabase.table("cases").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching cases: {e}")
            return []

    async def get_case_by_id(self, case_id: str) -> Optional[dict]:
        """Fetches a single case by ID."""
        try:
            response = self._supabase.table("cases").select("*").eq("id", case_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching case {case_id}: {e}")
            return None
