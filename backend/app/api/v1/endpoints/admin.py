from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import LawyerProfileResponse, AdminLawyerApprovalRequest
from app.services.admin_service import AdminService

router = APIRouter()

def get_admin_service() -> AdminService:
    return AdminService()

@router.get("/lawyers", response_model=List[LawyerProfileResponse])
async def get_pending_lawyers(status: str = "Pending", service: AdminService = Depends(get_admin_service)):
    """
    Retrieves all lawyers with the specified status (default: Pending).
    """
    # For now, we only support status=Pending based on service logic
    return await service.get_pending_lawyers()

@router.post("/lawyers/approve_reject")
async def approve_reject_lawyer(request: AdminLawyerApprovalRequest, service: AdminService = Depends(get_admin_service)):
    """
    Approves or rejects a pending lawyer application.
    """
    return await service.update_lawyer_status(request)

from app.services.stream_ingest_service import StreamIngestService

@router.post("/sync/stream")
async def sync_legal_data_stream(dataset: str = "vignesh612/indian-penal-code-dataset"):
    """
    Fetches legal data from Kaggle directly into memory and syncs it.
    """
    service = StreamIngestService()
    return await service.stream_and_index_dataset(dataset)
