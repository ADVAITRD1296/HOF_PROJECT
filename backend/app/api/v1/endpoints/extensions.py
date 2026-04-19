from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.extended_schemas import (
    CaseCardRequest, CaseCardResponse, 
    DeadlineRequest, DeadlineResponse,
    StrengthRequest, StrengthResponse,
    DurationRequest, DurationResponse,
    JourneyCreateRequest, JourneyUpdateRequest, JourneyResponse,
    BaseApiResponse
)
from app.services.case_card_service import CaseCardService
from app.services.deadline_service import DeadlineService
from app.services.strength_service import StrengthService
from app.services.duration_service import DurationService
from app.services.journey_service import JourneyService

router = APIRouter()

# Instantiate services
case_card_service = CaseCardService()
deadline_service = DeadlineService()
strength_service = StrengthService()
duration_service = DurationService()
journey_service = JourneyService()

@router.get("/test")
async def test_extensions():
    return {"status": "extensions router is reachable"}

# ── Feature 1: Shareable Case Card ──────────────────────────────────────────────

@router.post("/case-card/generate", response_model=BaseApiResponse)
async def generate_case_card(request: CaseCardRequest):
    try:
        data = await case_card_service.generate_card(
            summary=request.case_summary,
            law=request.applicable_law,
            steps=request.steps,
            user_name=request.user_name
        )
        return BaseApiResponse(success=True, data=data)
    except Exception as e:
        return BaseApiResponse(success=False, error=str(e))

@router.get("/case-card/{card_id}", response_model=BaseApiResponse)
async def get_case_card(card_id: str):
    data = await case_card_service.get_card(card_id)
    if not data:
        return BaseApiResponse(success=False, error="Case card not found")
    return BaseApiResponse(success=True, data=data)

# ── Feature 2: Deadline Calculator ──────────────────────────────────────────────

@router.post("/deadline/calculate", response_model=BaseApiResponse)
async def calculate_deadline(request: DeadlineRequest):
    try:
        data = await deadline_service.calculate_deadline(
            case_type=request.case_type,
            incident_date_str=request.incident_date,
            jurisdiction=request.jurisdiction
        )
        return BaseApiResponse(success=True, data=data)
    except Exception as e:
        return BaseApiResponse(success=False, error=str(e))

# ── Feature 3: Case Strength Calculator ─────────────────────────────────────────

@router.post("/case-strength/analyze", response_model=BaseApiResponse)
async def analyze_case_strength(request: StrengthRequest):
    try:
        data = await strength_service.analyze_strength(
            case_description=request.case_description,
            evidence_list=request.evidence_list,
            witnesses=request.witnesses,
            documentation=request.documentation,
            case_type=request.case_type
        )
        return BaseApiResponse(success=True, data=data)
    except Exception as e:
        return BaseApiResponse(success=False, error=str(e))

# ── Feature 4: Journey Tracker ──────────────────────────────────────────────────

@router.post("/journey/create", response_model=BaseApiResponse)
async def create_journey(request: JourneyCreateRequest):
    try:
        data = await journey_service.create_journey(
            case_type=request.case_type,
            description=request.problem_description,
            user_id=request.user_id,
            session_id=request.session_id
        )
        return BaseApiResponse(success=True, data=data)
    except Exception as e:
        return BaseApiResponse(success=False, error=str(e))

@router.post("/journey/{journey_id}/update", response_model=BaseApiResponse)
async def update_journey(journey_id: str, request: JourneyUpdateRequest):
    data = await journey_service.update_journey(
        journey_id=journey_id,
        step_name=request.step_name,
        status=request.step_status,
        notes=request.notes
    )
    if not data:
        return BaseApiResponse(success=False, error="Journey not found or update failed")
    return BaseApiResponse(success=True, data=data)

@router.get("/journey/{journey_id}", response_model=BaseApiResponse)
async def get_journey(journey_id: str):
    data = await journey_service.get_journey(journey_id)
    if not data:
        return BaseApiResponse(success=False, error="Journey not found")
    return BaseApiResponse(success=True, data=data)

@router.get("/journey/user/{user_id}", response_model=BaseApiResponse)
async def get_user_journeys(user_id: str):
    data = await journey_service.get_user_journeys(user_id)
    return BaseApiResponse(success=True, data=data)

# ── Feature 5: Case Duration Predictor ──────────────────────────────────────────

@router.post("/case-duration/estimate", response_model=BaseApiResponse)
async def estimate_case_duration(request: DurationRequest):
    try:
        data = await duration_service.estimate_duration(
            case_type=request.case_type,
            court_level=request.court_level,
            complexity=request.complexity,
            jurisdiction=request.jurisdiction
        )
        return BaseApiResponse(success=True, data=data)
    except Exception as e:
        return BaseApiResponse(success=False, error=str(e))
