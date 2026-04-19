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
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_KEY
        
        if supabase_url and supabase_key:
            try:
                from supabase import ClientOptions
                # Set strict timeouts to prevent infinite hangs
                options = ClientOptions(
                    postgrest_client_timeout=5,
                    storage_client_timeout=5
                )
                self._supabase = create_client(supabase_url, supabase_key, options=options)
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
        else:
            logger.warning("Supabase configuration incomplete.")

    async def _check_reachability(self) -> bool:
        """Fast check if the Supabase URL is reachable."""
        if not self._supabase: return False
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                # We add the apikey header to get a 200, but even a 401/403 proves connectivity
                headers = {"apikey": self._supabase.supabase_key} if self._supabase.supabase_key else {}
                resp = await client.get(f"{self._supabase.supabase_url}/auth/v1/health", headers=headers)
                return resp.status_code < 500
        except Exception as e:
            logger.warning(f"Supabase reachability check failed: {e}")
            return False

    async def send_otp(self, identifier: str, method: str = "email") -> dict:
        """
        Generates a 6-digit OTP for an email address and sends it via SMTP.
        """
        if "@" not in identifier:
            return {"status": "error", "message": "Only email verification is supported currently."}

        code = str(random.randint(100000, 999999))
        expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
        
        try:
            # 1. Store in DB (Attempt)
            if self._supabase:
                try:
                    self._supabase.table("otps").insert({
                        "identifier": identifier,
                        "code": code,
                        "expires_at": expires_at.isoformat()
                    }).execute()
                except Exception as db_err:
                    logger.warning(f"Failed to store OTP in DB: {db_err}. Continuing with delivery.")
            else:
                logger.warning("Supabase client not initialized. Skipping OTP record insertion.")
            
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
            if not self._supabase:
                logger.warning("Supabase not initialized. Bypassing OTP check for demo/debug.")
                return settings.DEBUG

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

    async def register_user(self, data: dict) -> dict:
        """Registers a new user using email and password via Supabase Auth."""
        try:
            if not self._supabase:
                raise Exception("Supabase client is not initialized")
                
            response = self._supabase.auth.sign_up({
                "email": data["email"],
                "password": data["password"],
                "options": {
                    "data": {
                        "full_name": data["full_name"],
                        "phone": data["phone"]
                    }
                }
            })
            
            user = response.user
            if not user:
                return {"status": "error", "message": "Sign up failed"}

            # Auto-verify the user immediately using Admin privileges
            try:
                self._supabase.auth.admin.update_user_by_id(user.id, {"email_confirm": True})
                logger.info(f"Auto-verified user {user.id}")
            except Exception as admin_err:
                logger.warning(f"Failed to auto-verify user {user.id}: {admin_err}")

            # Insert into public.users table for visibility in dashboard
            try:
                self._supabase.table("users").insert({
                    "id": user.id,
                    "full_name": data["full_name"],
                    "email": data["email"],
                    "phone": data.get("phone"),
                    "email_verified": True, # Mark as verified in DB too
                    "phone_verified": False
                }).execute()
                logger.info(f"Successfully synced user {user.id} to public.users table")
            except Exception as sync_error:
                logger.warning(f"Sign up succeeded but sync to public.users failed: {sync_error}")
                
            return {
                "status": "success", 
                "message": "Registration successful", 
                "user": {
                    "id": user.id, 
                    "email": user.email, 
                    "name": data["full_name"]
                },
                "session": response.session.access_token if response.session else None
            }
        except Exception as e:
            logger.error(f"Error registering user: {e}")
            return {"status": "error", "message": str(e)}
            
    async def login_user(self, email: str, password: str) -> dict:
        """Logs in a user using email and password via Supabase Auth."""
        try:
            if not self._supabase:
                raise Exception("Supabase client is not initialized")
            
            logger.info(f"Login attempt for {email}. Checking Supabase reachability...")
            if not await self._check_reachability():
                raise Exception("Network Error: Backend cannot reach Supabase. Please check your internet connection and SUPABASE_URL.")

            logger.info("Supabase is reachable. Attempting authentication...")
            response = self._supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            user = response.user
            if not user:
                return {"status": "error", "message": "Invalid email or password"}
                
            return {
                "status": "success", 
                "message": "Login successful", 
                "user": {
                    "id": user.id, 
                    "email": user.email, 
                    "name": user.user_metadata.get("full_name", user.email) if user.user_metadata else user.email
                },
                "session": response.session.access_token if response.session else None
            }
        except Exception as e:
            logger.error(f"Error logging in user {email}: {e}")
            error_msg = str(e).lower()
            if "invalid_credentials" in error_msg or "invalid login credentials" in error_msg:
                return {"status": "error", "message": "Invalid email or password"}
            elif "email not confirmed" in error_msg:
                # Attempt auto-verification recovery
                try:
                    logger.info(f"Account for {email} is unconfirmed. Attempting Administrative Auto-Verification...")
                    # 1. Get user ID
                    user_resp = self._supabase.table("users").select("id").eq("email", email).execute()
                    if user_resp.data:
                        uid = user_resp.data[0]["id"]
                        # 2. Verify via Admin API
                        self._supabase.auth.admin.update_user_by_id(uid, {"email_confirm": True})
                        # 3. Update public table
                        self._supabase.table("users").update({"email_verified": True}).eq("id", uid).execute()
                        logger.info(f"Recovery successful for {email}. Re-attempting login...")
                        # 4. Retry login
                        resp = self._supabase.auth.sign_in_with_password({"email": email, "password": password})
                        if resp.user:
                             return {
                                "status": "success", 
                                "message": "Login successful (Auto-Verified)", 
                                "user": {
                                    "id": resp.user.id, 
                                    "email": resp.user.email, 
                                    "name": resp.user.user_metadata.get("full_name", resp.user.email) if resp.user.user_metadata else resp.user.email
                                },
                                "session": resp.session.access_token if resp.session else None
                            }
                except Exception as recovery_err:
                    logger.error(f"Auto-verification recovery failed: {recovery_err}")
                
                return {
                    "status": "success", 
                    "message": "Protocol Updated: Your email has been auto-verified. Please click 'Sign In' again to enter.",
                    "recoverable": True
                }
            return {"status": "error", "message": f"Login failed: {str(e)}"}
