from fastapi import APIRouter, HTTPException
from app.services.auth_service import AuthService
from loguru import logger

router = APIRouter()

@router.get("/test-supabase")
async def test_supabase():
    """Diagnostic endpoint to verify Supabase connectivity."""
    service = AuthService()
    config_status = {
        "url_set": bool(settings.SUPABASE_URL),
        "key_set": bool(settings.SUPABASE_KEY),
        "service_key_set": bool(settings.SUPABASE_SERVICE_KEY)
    }

    if not service._supabase:
        return {
            "status": "error", 
            "message": "Supabase client not initialized.",
            "config": config_status
        }
    
    # Check Reachability
    is_reachable = await service._check_reachability()
    
    if is_reachable:
        return {
            "status": "success",
            "message": "Backend successfully reached Supabase. (Authentication is ready)",
            "url": service._supabase.supabase_url,
            "config": config_status
        }
    else:
        return {
            "status": "error",
            "message": "Network Timeout: Backend cannot reach Supabase. Check your internet connection or URL.",
            "url": service._supabase.supabase_url,
            "config": config_status
        }
