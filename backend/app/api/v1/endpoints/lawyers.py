from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.schemas import (
    LawyerRegistrationRequest,
    LawyerProfileResponse,
    LawyerMatchRequest,
    ContactLogRequest,
    OTPSendRequest,
    OTPVerifyRequest
)
from app.services.lawyer_service import LawyerService
from app.services.auth_service import AuthService

router = APIRouter()

def get_lawyer_service() -> LawyerService:
    return LawyerService()

def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=LawyerProfileResponse, summary="Register a new lawyer profile")
async def register_lawyer(
    request: LawyerRegistrationRequest,
    service: LawyerService = Depends(get_lawyer_service)
):
    """
    Onboards a newly registered lawyer, storing their location via PostGIS in Supabase.
    By default, status is set to Pending.
    """
    try:
        response = await service.register_lawyer(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/match", response_model=List[LawyerProfileResponse], summary="Match user to nearby lawyers")
async def match_lawyers(
    request: LawyerMatchRequest,
    service: LawyerService = Depends(get_lawyer_service)
):
    """
    Core algorithm to find lawyers.
    Uses AI to classify user query into a Practice Area, then executes
    a geographical proximity search ranking results by distance.
    """
    try:
        response = await service.match_lawyers(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contact-log", summary="Log contact interactions for analytics")
async def log_contact(
    request: ContactLogRequest,
    service: LawyerService = Depends(get_lawyer_service)
):
    """
    Logs when a user attempts to contact a lawyer (Call/WhatsApp).
    Stores it in Postgres for future review.
    """
    try:
        response = await service.log_contact(request)
        return response
    except Exception as e:
        logger.error(f"Error logging contact interaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-otp", summary="Send OTP for lawyer verification")
async def send_lawyer_otp(
    request: OTPSendRequest, 
    service: AuthService = Depends(get_auth_service)
):
    """
    Sends a 6-digit OTP to the lawyer's email address.
    """
    result = await service.send_otp(request.identifier, request.method)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message", "OTP Initialization Failed"))
    return result


@router.post("/verify-otp", summary="Verify lawyer OTP")
async def verify_lawyer_otp(
    request: OTPVerifyRequest, 
    service: AuthService = Depends(get_auth_service)
):
    """
    Verifies the OTP code provided by the lawyer.
    """
    success = await service.verify_otp(request.identifier, request.code)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")
    return {"status": "success", "message": "Lawyer email verified successfully"}
