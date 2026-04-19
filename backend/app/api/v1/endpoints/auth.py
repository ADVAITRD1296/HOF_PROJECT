from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import OTPSendRequest, OTPVerifyRequest, EmailVerificationRequest, LoginRequest, UserRegistrationRequest
from app.services.auth_service import AuthService

router = APIRouter()

def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/send-otp")
async def send_otp(request: OTPSendRequest, service: AuthService = Depends(get_auth_service)):
    """
    Sends a 6-digit OTP to the provided phone or email.
    """
    return await service.send_otp(request.identifier, request.method)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, service: AuthService = Depends(get_auth_service)):
    """
    Verifies the provided OTP code.
    """
    success = await service.verify_otp(request.identifier, request.code)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")
    return {"status": "success", "message": "OTP verified successfully"}

@router.post("/send-email-verification")
async def send_email_verification(request: EmailVerificationRequest, service: AuthService = Depends(get_auth_service)):
    """
    Sends a verification link to the user's email.
    """
    return await service.send_email_verification(request.email)

@router.get("/verify-email")
async def verify_email(token: str, email: str, service: AuthService = Depends(get_auth_service)):
    """
    Endpoint for the link in the verification email.
    """
    # Simply verify for now for demo
    return {"status": "success", "message": f"Email {email} verified successfully"}

@router.post("/register")
async def register(request: UserRegistrationRequest, service: AuthService = Depends(get_auth_service)):
    """
    Registers a new user with email and password via Supabase.
    """
    result = await service.register_user(request.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(request: LoginRequest, service: AuthService = Depends(get_auth_service)):
    """
    Logs in a user with email and password via Supabase.
    """
    result = await service.login_user(request.email, request.password)
    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])
    return result
