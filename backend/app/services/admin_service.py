from typing import List, Optional
from loguru import logger
from app.core.config import settings
from app.models.schemas import LawyerProfileResponse, AdminLawyerApprovalRequest
from supabase import create_client, Client

class AdminService:
    def __init__(self):
        self._supabase: Optional[Client] = None
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
            self._supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    async def get_pending_lawyers(self) -> List[LawyerProfileResponse]:
        """
        Retrieves all lawyers with 'Pending' status.
        """
        try:
            response = self._supabase.table("lawyers") \
                .select("*") \
                .eq("status", "Pending") \
                .execute()
            
            return [LawyerProfileResponse(**record) for record in response.data]
        except Exception as e:
            logger.error(f"Error fetching pending lawyers: {e}")
            return []

    async def update_lawyer_status(self, request: AdminLawyerApprovalRequest) -> dict:
        """
        Approves or Rejects a lawyer application.
        """
        status = "verified" if request.action == "approve" else "rejected"
        try:
            response = self._supabase.table("lawyers") \
                .update({"status": status}) \
                .eq("id", request.id) \
                .execute()
            
            if response.data:
                logger.info(f"Lawyer {request.id} status updated to {status}")
                return {"status": "success", "message": f"Lawyer {status.lower()} successfully."}
            return {"status": "error", "message": "Lawyer not found."}
        except Exception as e:
            logger.error(f"Error updating lawyer status: {e}")
            return {"status": "error", "message": str(e)}
