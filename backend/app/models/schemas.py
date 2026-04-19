"""
Pydantic schemas for request/response models.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


# ── Request Models ─────────────────────────────────────────────────────────────

class GuidanceRequest(BaseModel):
    query: str = Field(..., min_length=5, description="The user's legal question or situation")
    language: str = Field(default="en", description="Language: 'en' or 'hi'")
    context: Optional[str] = Field(default=None, description="Any additional context")
    doc_type: Optional[str] = Field(default=None, description="Document type: fir | complaint | notice")
    user_details: Optional[Dict[str, Any]] = Field(default=None, description="User-provided personal details for documents")
    city: Optional[str] = Field(default=None, description="User's city for location-aware guidance (e.g. 'Lucknow')")

    class Config:
        json_schema_extra = {
            "example": {
                "query": "My employer has not paid my salary for 3 months. What can I do?",
                "language": "en",
                "city": "Mumbai",
            }
        }


# ── Response Models ────────────────────────────────────────────────────────────

class LegalStep(BaseModel):
    step_number: int
    title: str
    description: str
    action_required: Optional[str] = None


class LegalCitation(BaseModel):
    act: str
    section: str
    description: str
    why_applicable: str


class CasePrecedent(BaseModel):
    title: str = Field(..., description="The name of the historical legal case")
    citation: str = Field(..., description="Official citation (e.g., 2023 SCC Online 456)")
    summary: str = Field(..., description="Brief summary of the case facts")
    outcome: str = Field(..., description="The final judgement or ruling")
    relevance: str = Field(..., description="Why this case is similar to the user's situation")
    similarity_score: str = Field(..., description="The factual similarity percentage")


class GuidanceResponse(BaseModel):
    query: str
    issue: str = Field(..., description="Short title of the legal issue")
    law: str = Field(..., description="Key acts and sections involved")
    reason: str = Field(..., description="Strategic rationale for the advice")
    summary: str
    detailed_analysis: str = Field(..., description="Deep architectural analysis of the situation")
    strength: int = Field(..., description="Numerical confidence score 1-100")
    steps: List[LegalStep]
    citations: List[LegalCitation]
    precedents: List[CasePrecedent] = Field(default_factory=list, description="Exactly 5 similar historical cases")
    suggested_actions: List[str]
    disclaimer: str = (
        "This is AI-generated legal guidance, not legal advice. "
        "Please consult a qualified lawyer for critical matters."
    )
    language: str
    location_guidance: Optional[Dict[str, Any]] = None


class DocumentResponse(BaseModel):
    doc_type: str
    title: str
    content: str
    disclaimer: str = "Review this draft with a lawyer before submission."


# ── Lawyer System Models ────────────────────────────────────────────────────────

class LawyerRegistrationRequest(BaseModel):
    full_name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    email: str
    bar_council_id: str
    state_bar_council: str
    practice_areas: List[str]
    experience_years: int
    office_address: str
    city: str
    pincode: str
    availability: str = Field(default="Both", description="Online, Offline, or Both")
    consultation_fee: Optional[float] = 0.0
    latitude: float
    longitude: float
    government_id_url: Optional[str] = None
    bar_id_card_url: Optional[str] = None

class LawyerProfileResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    email: str
    practice_areas: List[str]
    experience_years: int
    office_address: str
    city: str
    availability: str
    consultation_fee: float
    status: str
    distance_km: Optional[float] = None

class LawyerMatchRequest(BaseModel):
    user_query: str = Field(..., description="The user's legal issue to match practice area")
    latitude: float
    longitude: float
    radius_km: float = 20.0

class ContactLogRequest(BaseModel):
    lawyer_id: str
    user_phone: Optional[str] = None
    contact_method: str = Field(..., description="Call, WhatsApp, In-App")


# ── Verification & Auth Models ────────────────────────────────────────────────

class OTPSendRequest(BaseModel):
    identifier: str = Field(..., description="Email address (Phone verification is currently disabled)")
    method: str = Field(default="email", description="Only 'email' is supported currently")

class OTPVerifyRequest(BaseModel):
    identifier: str
    code: str

class EmailVerificationRequest(BaseModel):
    email: str

class UserRegistrationRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    password: str = Field(..., min_length=6)
    government_id_url: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfileResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    email: str
    phone_verified: bool
    email_verified: bool
    id_verified: bool
    role: str

class AdminLawyerApprovalRequest(BaseModel):
    id: str
    action: str = Field(..., description="approve or reject")
    reason: Optional[str] = None
class PDFRequest(BaseModel):
    content: str
    filename: Optional[str] = "legal_document"

# ── Location Feature Models ────────────────────────────────────────────────────

class NearbyPlacesRequest(BaseModel):
    query: str = Field(..., description="User query containing location")

class OSMPlace(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    distance_km: float
    map_link: str

class NearbyPlacesResponse(BaseModel):
    location_detected: Optional[str] = None
    requires_location_input: bool = False
    police_stations: List[OSMPlace] = Field(default_factory=list)
    courts: List[OSMPlace] = Field(default_factory=list)
    legal_services: List[OSMPlace] = Field(default_factory=list)
