from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# ── Feature 1: Case Card Schemas ──────────────────────────────────────────────

class CaseStep(BaseModel):
    step_number: int
    title: str
    description: str

class CaseCardRequest(BaseModel):
    case_summary: str = Field(..., min_length=10)
    applicable_law: str
    steps: List[Dict[str, Any]]
    user_name: Optional[str] = None

class CaseCardResponse(BaseModel):
    unique_card_id: UUID
    case_title: str
    applicable_sections: List[str]
    key_steps: List[CaseStep]
    created_at: datetime
    shareable_link: str

# ── Feature 2: Deadline Calculator Schemas ────────────────────────────────────

class DeadlineRequest(BaseModel):
    case_type: str
    incident_date: str # ISO format YYYY-MM-DD
    jurisdiction: Optional[str] = None

class DeadlineResponse(BaseModel):
    filing_deadline: str
    days_remaining: int
    limitation_period_days: int
    applicable_law: str
    warning_status: str # safe, urgent, critical, expired
    recommended_actions: List[str]

# ── Feature 3: Case Strength Calculator Schemas ───────────────────────────────

class StrengthRequest(BaseModel):
    case_description: str = Field(..., min_length=20)
    evidence_list: List[str]
    witnesses: bool
    documentation: bool
    case_type: str

class StrengthResponse(BaseModel):
    evidence_score: int
    documentation_score: int
    witness_score: int
    legal_merit_score: int
    overall_strength_score: int
    strength_label: str
    missing_elements: List[str]
    recommendation: str

# ── Feature 4: Journey Tracker Schemas ────────────────────────────────────────

class JourneyCreateRequest(BaseModel):
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    case_type: str
    problem_description: str

class JourneyUpdateRequest(BaseModel):
    step_name: str
    step_status: str # completed, skipped, pending
    notes: Optional[str] = None

class JourneyStep(BaseModel):
    step_name: str
    step_status: str
    notes: Optional[str] = None
    timestamp: datetime

class JourneyResponse(BaseModel):
    journey_id: UUID
    case_type: str
    problem_description: str
    status: str
    current_step: int
    steps_completed: List[JourneyStep]
    completion_percentage: float
    created_at: datetime
    updated_at: datetime

# ── Feature 5: Case Duration Predictor Schemas ────────────────────────────────

class DurationRequest(BaseModel):
    case_type: str
    court_level: str # District, High Court, Supreme Court
    complexity: str # Low, Medium, High
    jurisdiction: Optional[str] = None

class DurationResponse(BaseModel):
    estimated_months_min: int
    estimated_months_max: int
    confidence_score: int # 1-100
    factors_considered: List[str]
    bottlenecks: List[str]
    optimizations: List[str]
    precedent_basis: str

# ── Generic Response Wrapper ───────────────────────────────────────────────

class BaseApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
