"""
Document Generation Module — LexisCo
Generates structured Indian legal documents using Groq LLM.
Robust, flexible, and handles missing data gracefully.
"""

import os
import json
from loguru import logger
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

# --- FALLBACK TEMPLATES ---
# Used if LLM fails. Clean formatting, NO placeholders like [Date].

TEMPLATES = {
    "fir": """
TO THE OFFICER-IN-CHARGE,
POLICE STATION: {location}

SUBJECT: FIRST INFORMATION REPORT (FIR) REGARDING {description}

RESPECTED SIR/MADAM,

I, {complainantName}, son/daughter of {fatherName}, residing at {address}, phone number {phone}, would like to report an incident that occurred on {dateOfIncident} at {timeOfIncident} near {location}.

INCIDENT DETAILS:
{description}

ACCUSED DETAILS:
{accusedName}

EVIDENCE PROVIDED:
{evidence}

I request you to register this FIR under the relevant sections of the Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC) and initiate a prompt investigation.

YOURS FAITHFULLY,

(SIGNATURE)
{complainantName}
DATE: {currentDate}
""",
    "legal_notice": """
LEGAL NOTICE

BY REGISTERED AD/SPEED POST

DATE: {currentDate}

TO,
{accusedName}
ADDRESS: {location}

SUBJECT: LEGAL NOTICE REGARDING {description}

UNDER INSTRUCTIONS FROM MY CLIENT {complainantName}, residing at {address}, I hereby serve you with the following legal notice:

1. My client states that on {dateOfIncident}, the following incident occurred: {description}.
2. Despite repeated requests, you have failed to resolve the matter.
3. Your actions have caused significant distress and legal injury to my client.

You are hereby called upon to settle this matter within 15 days of receipt of this notice, failing which my client will be constrained to initiate appropriate legal proceedings against you in a court of competent jurisdiction.

(SIGNATURE)
SENDER: {complainantName}
ON BEHALF OF THE AGGRIEVED PARTY
""",
    "consumer_complaint": """
BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, {location}

CONSUMER COMPLAINT NO. _____ OF 202X

IN THE MATTER OF:
{complainantName}, S/O {fatherName},
RESIDING AT {address}
... COMPLAINANT

VERSUS

{accusedName}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

MOST RESPECTFULLY SHOWETH:

1. That the Complainant purchased/availed services regarding {description} from the Opposite Party.
2. That on {dateOfIncident}, the Complainant faced the following issues: {description}.
3. That there is a clear deficiency in service and unfair trade practice on the part of the Opposite Party.

PRAYER:
It is, therefore, prayed that this Hon'ble Commission may be pleased to direct the Opposite Party to refund the amount and pay compensation for mental agony and litigation costs.

(SIGNATURE)
{complainantName}
(COMPLAINANT)
""",
    "cybercrime_complaint": """
TO,
THE CYBER CRIME CELL,
CITY: {location}

SUBJECT: COMPLAINT REGARDING CYBER CRIME - {description}

RESPECTED SIR/MADAM,

I, {complainantName}, son/daughter of {fatherName}, residing at {address}, phone number {phone}, wish to report a cybercrime incident.

INCIDENT DETAILS:
- TYPE OF CRIME: Cyber Fraud / Harassment
- DATE & TIME: {dateOfIncident} at {timeOfIncident}
- DESCRIPTION: {description}
- SUSPECT DETAILS: {accusedName}
- EVIDENCE: {evidence}

I have already reported this on the National Cyber Crime Reporting Portal (cybercrime.gov.in). I request you to investigate this matter urgently and block any fraudulent transactions if applicable.

YOURS FAITHFULLY,

(SIGNATURE)
{complainantName}
DATE: {currentDate}
"""
}

# --- LLM GENERATION ---

def _get_groq_client():
    """Initialize Groq client."""
    if Groq and settings.GROQ_API_KEY:
        try:
            return Groq(api_key=settings.GROQ_API_KEY)
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
    return None

async def _generate_with_llm(doc_type: str, data: Dict[str, Any], language: str = "en") -> Optional[str]:
    """Internal helper to generate document using Groq."""
    client = _get_groq_client()
    if not client:
        return None

    doc_name = doc_type.replace("_", " ").upper()
    lang_name = "Hindi" if language == "hi" else "English"
    
    evidence_str = ", ".join(data.get("evidence", [])) if isinstance(data.get("evidence"), list) else str(data.get("evidence", "Not Provided"))
    
    prompt = f"""Generate a formal {doc_name} under Indian law in {lang_name} language.

Details:
* Name: {data.get('complainantName')}
* Father's Name: {data.get('fatherName')}
* Address: {data.get('address')}
* Phone: {data.get('phone')}
* Incident: {data.get('description')}
* Date of Incident: {data.get('dateOfIncident')}
* Time: {data.get('timeOfIncident')}
* Location: {data.get('location')}
* Accused: {data.get('accusedName')}
* Evidence: {evidence_str}

STRICT INSTRUCTIONS:
* DO NOT use placeholders like [Name], [Date], [Place].
* ALWAYS replace with actual values provided above.
* If some fields are missing:
    - Infer from context if possible
    - Omit gracefully if not critical
    - Use "Not Provided" or a professional alternative only if absolutely necessary.
* Use formal legal tone and follow real Indian format.
* Ensure the document is complete, professional, and ready to submit.
* Return ONLY the document text in {lang_name}.
"""

    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2048,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Groq generation failed for {doc_type}: {e}")
        return None

# --- INDIVIDUAL GENERATION FUNCTIONS ---

async def generate_fir(data: Dict[str, Any], language: str = "en") -> str:
    """Generate a First Information Report (FIR)."""
    result = await _generate_with_llm("FIR", data, language)
    if not result:
        return TEMPLATES["fir"].format(**data)
    return result

async def generate_legal_notice(data: Dict[str, Any], language: str = "en") -> str:
    """Generate a Legal Notice."""
    result = await _generate_with_llm("LEGAL_NOTICE", data, language)
    if not result:
        return TEMPLATES["legal_notice"].format(**data)
    return result

async def generate_consumer_complaint(data: Dict[str, Any], language: str = "en") -> str:
    """Generate a Consumer Complaint."""
    result = await _generate_with_llm("CONSUMER_COMPLAINT", data, language)
    if not result:
        return TEMPLATES["consumer_complaint"].format(**data)
    return result

async def generate_cybercrime_complaint(data: Dict[str, Any], language: str = "en") -> str:
    """Generate a Cybercrime Complaint."""
    result = await _generate_with_llm("CYBERCRIME_COMPLAINT", data, language)
    if not result:
        return TEMPLATES["cybercrime_complaint"].format(**data)
    return result

# --- PUBLIC DISPATCHER ---

async def generate_document(doc_type: Optional[str], data: Dict[str, Any], language: str = "en") -> Dict[str, str]:
    """
    Main entry point for document generation.
    Routes to specific functions based on type.
    """
    # 1. Normalize Document Type
    doc_type = (doc_type or data.get("type") or "FIR").upper()
    
    # 2. Normalize Fields
    complainantName = (
        data.get("complainantName")
        or data.get("name")
        or data.get("user_name")
        or "Not Provided"
    )
    description = (
        data.get("description")
        or data.get("query")
        or data.get("incident")
        or "Incident reported by user."
    )
    location = (
        data.get("location")
        or data.get("address")
        or "Not Provided"
    )
    
    normalized_data = {
        "complainantName": complainantName,
        "description": description,
        "location": location,
        "fatherName": data.get("fatherName") or "Not Provided",
        "address": data.get("address") or location,
        "phone": data.get("phone") or "Not Provided",
        "dateOfIncident": data.get("dateOfIncident") or "Not Provided",
        "timeOfIncident": data.get("timeOfIncident") or "Not Provided",
        "accusedName": data.get("accusedName") or "Unknown Suspect",
        "evidence": data.get("evidence") or "Not Provided",
        "currentDate": datetime.now().strftime("%d %B %Y")
    }
    
    # 3. Route to specific function
    if doc_type == "FIR":
        doc_content = await generate_fir(normalized_data, language)
    elif doc_type == "LEGAL_NOTICE":
        doc_content = await generate_legal_notice(normalized_data, language)
    elif doc_type == "CONSUMER_COMPLAINT":
        doc_content = await generate_consumer_complaint(normalized_data, language)
    elif doc_type == "CYBERCRIME_COMPLAINT":
        doc_content = await generate_cybercrime_complaint(normalized_data, language)
    else:
        # fallback to FIR
        doc_type = "FIR"
        doc_content = await generate_fir(normalized_data, language)

    # 4. Final Aggressive Cleanup (Remove any leftover [Placeholders] or ________)
    import re
    # Replace common bracketed placeholders
    doc_content = re.sub(r'\[NAME\]|\[COMPLAINANT NAME\]', complainantName, doc_content, flags=re.I)
    doc_content = re.sub(r'\[LOCATION\]|\[PLACE\]|\[ADDRESS\]|\[POLICE STATION\]', location, doc_content, flags=re.I)
    doc_content = re.sub(r'\[DATE\]|\[CURRENT DATE\]', normalized_data["currentDate"], doc_content, flags=re.I)
    
    # Final sweep: replace any remaining [Anything] with "Not Provided"
    doc_content = re.sub(r'\[.*?\]', "Not Provided", doc_content)
    # Replace long underscore lines with something professional or remove them
    doc_content = re.sub(r'_{5,}', normalized_data["currentDate"], doc_content)

    return {
        "type": doc_type,
        "document": doc_content
    }
