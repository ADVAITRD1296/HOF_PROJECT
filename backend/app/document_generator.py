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
PRATHAM SUCHNA REPORT (FIRST INFORMATION REPORT)
(Under Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023 / Section 154 CrPC)

1. DISTRICT: {location}        2. POLICE STATION: {location}
3. YEAR: 202X                  4. FIR NO: [NOT ASSIGNED]

TO,
THE OFFICER-IN-CHARGE,
POLICE STATION: {location}

SUBJECT: REGISTRATION OF FIR REGARDING {description}

RESPECTED SIR/MADAM,

I, {complainantName}, son/daughter of {fatherName}, residing at {address}, would like to report the following cognizable offence:

INCIDENT DETAILS:
- DATE OF OCCURRENCE: {dateOfIncident}
- TIME: {timeOfIncident}
- PLACE: {location}

DESCRIPTION: {description}

ACCUSED DETAILS:
{accusedName}

EVIDENCE: {evidence}

I PRAY THAT THE FIR BE REGISTERED AND INVESTIGATION COMMENCED IMMEDIATELY.

(SIGNATURE)
{complainantName}
DATE: {currentDate}
""",
    "legal_notice": """
BY REGISTERED POST WITH ACK. DUE

DATE: {currentDate}

TO,
{accusedName}
ADDRESS: {location}

SUBJECT: LEGAL NOTICE UNDER INSTRUCTION OF MY CLIENT {complainantName}

SIRS,

UNDER INSTRUCTION FROM MY CLIENT {complainantName}, RESIDING AT {address}, I HEREBY SERVE YOU WITH THE FOLLOWING LEGAL NOTICE:

1. That my client is {complainantName} and you are the Opposite Party.
2. That on {dateOfIncident}, {description}.
3. That your conduct amounts to a violation of my client's legal rights.

YOU ARE HEREBY CALLED UPON TO COMPLY WITH MY CLIENT'S DEMAND WITHIN 15 DAYS OF RECEIPT OF THIS NOTICE, FAILING WHICH MY CLIENT SHALL BE CONSTRAINED TO INITIATE CIVIL AND CRIMINAL PROCEEDINGS IN A COURT OF COMPETENT JURISDICTION AT YOUR ENTIRE RISK AND CONSEQUENCE.

(SIGNATURE)
SENDER: {complainantName}
ON BEHALF OF THE AGGRIEVED PARTY
""",
    "consumer_complaint": """
BEFORE THE HON'BLE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, {location}

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

1. That the Complainant is a 'Consumer' as defined under the CP Act, 2019.
2. That the Opposite Party is {accusedName}.
3. That on {dateOfIncident}, {description}.
4. That there is an 'Unfair Trade Practice' and 'Deficiency in Service' by the Opposite Party.

PRAYER:
IT IS, THEREFORE, MOST RESPECTFULLY PRAYED THAT THIS HON'BLE COMMISSION MAY GRACIOUSLY BE PLEASED TO:
(a) Direct the Opposite Party to refund the amount;
(b) Award compensation for mental agony and litigation costs.

(SIGNATURE)
{complainantName}
(COMPLAINANT)
""",
    "cybercrime_complaint": """
TO,
THE OFFICER-IN-CHARGE,
CYBER CRIME CELL, {location}

SUBJECT: COMPLAINT REGARDING {description}

RESPECTED SIR/MADAM,

I, {complainantName}, son/daughter of {fatherName}, residing at {address}, report the following cyber-incident:

INCIDENT DETAILS:
- NATURE: Cyber Fraud / Harassment
- DATE: {dateOfIncident}
- DESCRIPTION: {description}

I REQUEST YOU TO TAKE NECESSARY ACTION AND REGISTER THIS UNDER THE RELEVANT SECTIONS OF THE IT ACT AND BNS.

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
    
    # TYPE-SPECIFIC AUTHENTICITY FRAMING
    framing = ""
    if doc_type == "FIR":
        framing = """
        * MUST include "PRATHAM SUCHNA REPORT" header.
        * Structure: District/PS Header -> Informant Details -> Occurrence Details -> Narrative -> Prayer for Registration.
        * Use language like "Cognizable Offence" and "Investigation".
        """
    elif "NOTICE" in doc_type:
        framing = """
        * MUST include "BY REGISTERED POST WITH AD" and "LEGAL NOTICE" headers.
        * Frame it from the perspective of an advocate/sender giving "INSTRUCTIONS".
        * MUST include a "15-day Statutory Period" for compliance.
        * Use language like "Constrained to initiate legal proceedings" and "Your entire risk and consequence".
        """
    elif "COMPLAINT" in doc_type:
        framing = """
        * MUST include Court Header: "BEFORE THE HON'BLE DISTRICT CONSUMER COMMISSION".
        * Use "MOST RESPECTFULLY SHOWETH" to introduce facts.
        * MUST include a formal "PRAYER" section at the end for relief/compensation.
        * Use language like "Deficiency in Service" and "Unfair Trade Practice".
        """

    prompt = f"""Generate a highly authentic {doc_name} under Indian law in {lang_name} language.
    
{framing}

Details for this specific document:
* Complainant: {data.get('complainantName')}
* Father's Name: {data.get('fatherName')}
* Address: {data.get('address')}
* Case Description: {data.get('description')}
* Date of Incident: {data.get('dateOfIncident')}
* Location: {data.get('location')}
* Accused: {data.get('accusedName')}
* Evidence: {evidence_str}

STRICT INSTRUCTIONS:
* Use REAL legal terminology applicable in Indian Courts.
* DO NOT use placeholders; fill all data from the details provided.
* Maintain a professional, stern, and legally robust tone.
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
    if doc_type == "NOTICE":
        doc_type = "LEGAL_NOTICE"
    elif doc_type == "COMPLAINT":
        doc_type = "CONSUMER_COMPLAINT"
    
    # 2. Normalize Fields (Accept both frontend simple names and formal backend names)
    complainantName = (
        data.get("complainantName")
        or data.get("name")
        or data.get("user_name")
        or "Not Provided"
    )
    description = (
        data.get("description")
        or data.get("details")
        or data.get("query")
        or data.get("incident")
        or "Incident reported by user."
    )
    location = (
        data.get("location")
        or data.get("address")
        or "Not Provided"
    )
    dateOfIncident = (
        data.get("dateOfIncident")
        or data.get("date")
        or "Not Provided"
    )
    
    normalized_data = {
        "complainantName": complainantName,
        "description": description,
        "location": location,
        "fatherName": data.get("fatherName") or "Not Provided",
        "address": data.get("address") or location,
        "phone": data.get("phone") or "Not Provided",
        "dateOfIncident": dateOfIncident,
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
