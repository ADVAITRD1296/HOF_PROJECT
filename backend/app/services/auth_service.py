import random
import datetime
import httpx
from typing import Optional
from loguru import logger
from app.core.config import settings
from supabase import create_client, Client

from app.services.notification_service import NotificationService

class AuthService:
    def __init__(self):
        self._supabase: Optional[Client] = None
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
            self._supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    async def send_otp(self, identifier: str, method: str = "email") -> dict:
        """
        Generates a 6-digit OTP for an email address and sends it via SMTP.
        """
        if "@" not in identifier:
            return {"status": "error", "message": "Only email verification is supported currently."}

        code = str(random.randint(100000, 999999))
        expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
        
        try:
            # 1. Store in DB
            self._supabase.table("otps").insert({
                "identifier": identifier,
                "code": code,
                "expires_at": expires_at.isoformat()
            }).execute()
            
            # 2. Attempt Delivery (Email Only)
            html = f"<h3>Verification Code</h3><p>Your LexisCo code is: <b>{code}</b></p>"
            sent_status = await NotificationService.send_email_smtp(identifier, "LexisCo OTP", html)

            response = {"status": "success", "message": f"Verification code sent to {identifier}"}
            
            # 3. Fallback / Debug Mode
            if not sent_status or settings.DEBUG:
                NotificationService.log_loud_mock(identifier, "email-otp", code)
                response["debug_code"] = code
                
            return response
        except Exception as e:
            logger.error(f"Error in send_otp: {e}")
            return {"status": "error", "message": str(e)}

    async def verify_otp(self, identifier: str, code: str) -> bool:
        """Checks if code matches and is valid."""
        try:
            now = datetime.datetime.now(datetime.timezone.utc).isoformat()
            response = self._supabase.table("otps") \
                .select("*") \
                .eq("identifier", identifier) \
                .eq("code", code) \
                .gt("expires_at", now) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False

    async def send_email_verification(self, email: str) -> dict:
        """Sends a verification magic link."""
        token = f"verify_{random.randint(10000, 99999)}"
        verify_url = f"{settings.APP_ENV}/verify?token={token}&email={email}"
        
        html = f"<h3>Verify Email</h3><p>Click <a href='{verify_url}'>here</a> to verify.</p>"
        sent_status = await NotificationService.send_email_smtp(email, "Verify Email - LexisCo", html)

        response = {"status": "success", "message": f"Verification link sent to {email}"}
        if not sent_status or settings.DEBUG:
            NotificationService.log_loud_mock(email, "link", verify_url)
            response["debug_link"] = verify_url
            
        return response
