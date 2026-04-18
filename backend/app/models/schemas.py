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

    class Config:
        json_schema_extra = {
            "example": {
                "query": "My employer has not paid my salary for 3 months. What can I do?",
                "language": "en",
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


class GuidanceResponse(BaseModel):
    query: str
    summary: str
    steps: List[LegalStep]
    citations: List[LegalCitation]
    suggested_actions: List[str]
    disclaimer: str = (
        "This is AI-generated legal guidance, not legal advice. "
        "Please consult a qualified lawyer for critical matters."
    )
    language: str


class DocumentResponse(BaseModel):
    doc_type: str
    title: str
    content: str
    disclaimer: str = "Review this draft with a lawyer before submission."


class PDFRequest(BaseModel):
    content: str
    filename: Optional[str] = "legal_document"
