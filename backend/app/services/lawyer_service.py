import json
from loguru import logger
from typing import List, Optional
from pydantic import BaseModel

from app.core.config import settings
from app.models.schemas import (
    LawyerRegistrationRequest,
    LawyerProfileResponse,
    LawyerMatchRequest,
    ContactLogRequest
)
from app.core.prompts import CASE_CLASSIFICATION_PROMPT

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

try:
    from groq import Groq
except ImportError:
    Groq = None

class LawyerService:
    def __init__(self):
        self._supabase: Optional[Client] = None
        self._groq_client = None

    def _load_supabase(self):
        if self._supabase is None:
            if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and Client:
                self._supabase = create_client(
                    settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
                )
        return self._supabase

    def _load_groq_client(self):
        if self._groq_client is None:
            if settings.GROQ_API_KEY and Groq:
                self._groq_client = Groq(api_key=settings.GROQ_API_KEY)
        return self._groq_client

    async def register_lawyer(self, request: LawyerRegistrationRequest) -> LawyerProfileResponse:
        supabase = self._load_supabase()
        if not supabase:
            raise Exception("Supabase client not initialized")

        # Convert to dictionary and map location
        data = request.model_dump()
        lat = data.pop("latitude")
        lng = data.pop("longitude")
        
        # PostGIS requires WKT point format: POINT(long lat)
        data["location"] = f"SRID=4326;POINT({lng} {lat})"
        
        # Mark email as verified since registration occurs post-OTP
        data["email_verified"] = True
        # Explicitly set status to match DB constraint expectation
        data["status"] = "Pending"
        
        try:
            try:
                response = supabase.table("lawyers").insert(data).execute()
            except Exception as e:
                # If column doesn't exist, remove it and retry
                error_str = str(e).lower()
                cols_to_check = ["email_verified", "id_verified", "state_bar_council"]
                if "column" in error_str and any(col in error_str for col in cols_to_check):
                    logger.warning(f"Detection: Database schema mismatch. Retrying without missing columns: {e}")
                    for col in cols_to_check:
                        if col in error_str:
                            data.pop(col, None)
                    response = supabase.table("lawyers").insert(data).execute()
                else:
                    raise e

            if not response.data:
                raise Exception("Failed to insert lawyer record")
                
            record = response.data[0]
            
            # PostGIS returns EWKB location, strip it from response mapping
            return LawyerProfileResponse(
                id=record["id"],
                full_name=record["full_name"],
                phone=record["phone"],
                email=record["email"],
                practice_areas=record["practice_areas"],
                experience_years=record["experience_years"],
                office_address=record["office_address"],
                city=record["city"],
                availability=record["availability"],
                consultation_fee=record["consultation_fee"],
                status=record["status"]
            )
        except Exception as e:
            logger.error(f"Error registering lawyer: {e}")
            raise Exception(f"Registration failed: {str(e)}")

    async def match_lawyers(self, request: LawyerMatchRequest) -> List[LawyerProfileResponse]:
        supabase = self._load_supabase()
        groq_client = self._load_groq_client()
        
        if not supabase:
            raise Exception("Supabase client not available")

        # 1. Use AI to resolve Case Type from user query string
        # Default to "All" if query is empty or generic to allow broad geolocation suggestions
        case_type = "All"
        generic_queries = ["", "nearby_all", "general legal help", "find lawyers near me"]
        
        should_classify = request.user_query and request.user_query.lower() not in generic_queries
        
        if groq_client and should_classify:
            prompt = CASE_CLASSIFICATION_PROMPT.format(query=request.user_query)
            try:
                chat = groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                res = json.loads(chat.choices[0].message.content)
                case_type = res.get("category", "All")
                logger.info(f"AI classified query '{request.user_query}' as: {case_type}")
            except Exception as e:
                logger.warning(f"Failed AI classification, falling back to 'All': {e}")
        else:
            logger.info("Using 'All' category for generic or empty query.")
        
        # 2. Call Spatial RPC in Supabase
        try:
            # Explicitly pass parameters to ensure match with RPC signature
            logger.info(f"Calling find_nearby_lawyers at ({request.latitude}, {request.longitude}) radius={request.radius_km}km category={case_type}")
            
            rpc_response = supabase.rpc("find_nearby_lawyers", {
                "u_lat": float(request.latitude),
                "u_lng": float(request.longitude),
                "r_km": float(request.radius_km),
                "c_type": str(case_type)
            }).execute()
            
            raw_data = rpc_response.data or []
            logger.info(f"RPC returned {len(raw_data)} nearby lawyers.")
            return [LawyerProfileResponse(**record) for record in raw_data]
            
        except Exception as e:
            logger.error(f"RPC query error matching lawyers: {e}")
            raise Exception(f"Failed to match nearby lawyers: {str(e)}")

    async def log_contact(self, request: ContactLogRequest) -> dict:
        supabase = self._load_supabase()
        if not supabase:
            raise Exception("Supabase client not initialized")
            
        data = request.model_dump()
        try:
            supabase.table("contact_logs").insert(data).execute()
            return {"status": "success", "message": "Interaction saved for analytics"}
        except Exception as e:
            logger.error(f"Error logging contact interaction: {e}")
            return {"status": "error", "message": str(e)}
