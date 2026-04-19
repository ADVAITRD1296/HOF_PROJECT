import uuid
from uuid import UUID
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings
from loguru import logger
from app.models.extended_schemas import JourneyResponse, JourneyStep

try:
    from supabase import create_client, Client
except ImportError:
    Client = None

class JourneyService:
    STANDARD_STEPS = {
        "consumer_complaint": [
            "Problem Identified", "Evidence Collected", "Notice Sent to Company", 
            "Consumer Forum Application Filed", "Hearing Scheduled", "Resolution"
        ],
        "fir": [
            "Incident Documented", "Police Station Identified", "FIR Filed", 
            "Acknowledgement Received", "Follow-up Done", "Case Status Check"
        ],
        "rti": [
            "Information Identified", "RTI Application Drafted", "Application Filed (PIO)", 
            "30-Day Response Window", "First Appeal (if needed)", "CIC Appeal (if needed)"
        ]
    }

    def __init__(self):
        self._supabase: Optional[Client] = None

    def _load_supabase(self) -> Optional[Client]:
        if self._supabase is None:
            if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and Client:
                self._supabase = create_client(
                    settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
                )
        return self._supabase

    async def create_journey(self, case_type: str, description: str, user_id: Optional[str] = None, session_id: Optional[str] = None) -> JourneyResponse:
        supabase = self._load_supabase()
        journey_id = uuid.uuid4()
        now = datetime.now()
        
        # Initialize steps_completed with a placeholder or empty based on the flow
        # But we'll follow the requested structure
        data = {
            "id": str(journey_id),
            "user_id": user_id,
            "session_id": session_id,
            "case_type": case_type,
            "problem_description": description,
            "status": "initiated",
            "current_step": 1,
            "steps_completed": [],
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
        
        if supabase:
            try:
                supabase.table("journeys").insert(data).execute()
            except Exception as e:
                logger.error(f"Error creating journey: {e}")
        
        return self._format_response(data)

    async def update_journey(self, journey_id: str, step_name: str, status: str, notes: Optional[str] = None) -> Optional[JourneyResponse]:
        supabase = self._load_supabase()
        if not supabase:
            return None
        
        try:
            # 1. Get existing journey
            response = supabase.table("journeys").select("*").eq("id", journey_id).execute()
            if not response.data:
                return None
            
            journey = response.data[0]
            steps = journey.get("steps_completed", [])
            
            # 2. Add new step log
            new_step = {
                "step_name": step_name,
                "step_status": status,
                "notes": notes,
                "timestamp": datetime.now().isoformat()
            }
            steps.append(new_step)
            
            # 3. Increment current_step
            current_step = journey.get("current_step", 1) + 1
            
            # 4. Update DB
            update_data = {
                "steps_completed": steps,
                "current_step": current_step,
                "updated_at": datetime.now().isoformat()
            }
            
            update_res = supabase.table("journeys").update(update_data).eq("id", journey_id).execute()
            if update_res.data:
                return self._format_response(update_res.data[0])
                
        except Exception as e:
            logger.error(f"Error updating journey: {e}")
            
        return None

    async def get_journey(self, journey_id: str) -> Optional[JourneyResponse]:
        supabase = self._load_supabase()
        if not supabase: return None
        try:
            res = supabase.table("journeys").select("*").eq("id", journey_id).execute()
            if res.data:
                return self._format_response(res.data[0])
        except Exception as e:
            logger.error(f"Error getting journey: {e}")
        return None

    async def get_user_journeys(self, user_id: str) -> List[JourneyResponse]:
        supabase = self._load_supabase()
        if not supabase: return []
        try:
            res = supabase.table("journeys").select("*").eq("user_id", user_id).execute()
            return [self._format_response(j) for j in res.data]
        except Exception as e:
            logger.error(f"Error getting user journeys: {e}")
        return []

    def _format_response(self, data: Dict[str, Any]) -> JourneyResponse:
        case_type = data.get("case_type", "consumer_complaint")
        total_steps = len(self.STANDARD_STEPS.get(case_type, [1, 2, 3]))
        current_step = data.get("current_step", 1)
        
        # Simple completion % logic
        completion = (len(data.get("steps_completed", [])) / total_steps) * 100
        
        return JourneyResponse(
            journey_id=UUID(data["id"]),
            case_type=case_type,
            problem_description=data.get("problem_description", ""),
            status=data.get("status", "initiated"),
            current_step=current_step,
            steps_completed=[JourneyStep(**s) for s in data.get("steps_completed", [])],
            completion_percentage=round(min(100, completion), 2),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00"))
        )
