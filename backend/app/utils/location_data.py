"""
Location Data — LexisCo
Contains raw mapping of cities to legal authorities and issue-specific static data.
"""

LOCATION_DATA = {
    "lucknow": {
        "police": [
            "Hazratganj Police Station",
            "Aliganj Police Station"
        ],
        "court": [
            "Lucknow District Court"
        ],
        "labour": ["Labour Office Lucknow"],
        "consumer": ["Consumer Forum Lucknow"],
        "women": ["Mahila Thana Lucknow"]
    },
    "delhi": {
        "police": [
            "Connaught Place Police Station",
            "Parliament Street Police Station"
        ],
        "court": [
            "Tis Hazari Court",
            "Patiala House Court"
        ],
        "labour": ["Labour Commissioner Office Delhi"],
        "consumer": ["District Consumer Disputes Redressal Commission, Delhi"],
        "women": ["Crime Against Women Cell"]
    },
    "mumbai": {
        "police": [
            "Colaba Police Station",
            "Bandra Police Station"
        ],
        "court": [
            "Bombay High Court",
            "Killa Court"
        ],
        "labour": ["Labour Commissioner Office Mumbai"],
        "consumer": ["State Consumer Disputes Redressal Commission, Mumbai"],
        "women": ["Mahila Police Station Mumbai"]
    },
    "bangalore": {
        "police": [
            "Cubbon Park Police Station",
            "Indiranagar Police Station"
        ],
        "court": [
            "Bangalore District Court"
        ],
        "labour": ["Labour Commissioner Office Bangalore"],
        "consumer": ["Karnataka State Consumer Disputes Redressal Commission"],
        "women": ["Mahila Police Station Basavanagudi"]
    },
    "chennai": {
        "police": [
            "Anna Salai Police Station",
            "Mylapore Police Station"
        ],
        "court": [
            "Madras High Court",
            "Egmore Court"
        ],
        "labour": ["Labour Commissioner Office Chennai"],
        "consumer": ["Tamil Nadu State Consumer Disputes Redressal Commission"],
        "women": ["All Women Police Station Chennai"]
    },
    "hyderabad": {
        "police": [
            "Banjara Hills Police Station",
            "Jubilee Hills Police Station"
        ],
        "court": [
            "Hyderabad District Court"
        ],
        "labour": ["Labour Commissioner Office Hyderabad"],
        "consumer": ["Telangana State Consumer Disputes Redressal Commission"],
        "women": ["Women Police Station Begumpet"]
    }
}

ISSUE_MAPPING = {
    "cybercrime": {
        "primary_keys": ["police"],
        "secondary_keys": ["court"],
        "reasons": {
            "police": "Primary authority to register an FIR and block fraudulent transactions.",
            "court": "Used if police refuse to file FIR or for further legal escalation."
        },
        "helpline": "1930",
        "portal": "https://cybercrime.gov.in",
        "required_documents": ["ID proof", "Bank statement highlighting fraud", "Screenshots of chats/transactions"],
        "what_to_say": "I want to file a cybercrime complaint regarding online fraud. Here is the evidence and transaction history.",
        "urgency": "Call 1930 immediately! The golden hour to freeze funds is within 2-4 hours of the fraud.",
        "next_step": "If the police do not register an FIR, you can file a complaint with the Magistrate under Section 156(3) CrPC."
    },
    "consumer": {
        "primary_keys": ["consumer"],
        "secondary_keys": ["court"],
        "reasons": {
            "consumer": "Handles grievances against companies for defective products or deficient services.",
            "court": "For appeals or if the claim exceeds the District Forum's financial jurisdiction."
        },
        "helpline": "1800-11-4000",
        "portal": "https://edaakhil.nic.in",
        "required_documents": ["ID proof", "Original invoice/receipt", "Warranty card", "Copy of complaint email sent to the company"],
        "what_to_say": "I want to file a consumer complaint against a company for defective service. They have ignored my prior notices.",
        "urgency": "File the complaint within 2 years from the date the dispute arose. Try the eDaakhil portal for faster filing.",
        "next_step": "Send a formal legal notice to the company before filing the case in the Consumer Forum."
    },
    "fir": {
        "primary_keys": ["police"],
        "secondary_keys": ["court"],
        "reasons": {
            "police": "Jurisdictional police station where the FIR must be registered.",
            "court": "Approached if the police refuse to register the FIR."
        },
        "helpline": "112",
        "portal": "https://www.india.gov.in/official-website-police",
        "required_documents": ["ID proof", "Written description of the incident", "Photographic or medical evidence (if applicable)", "Witness details"],
        "what_to_say": "I want to report a criminal offense that occurred recently. Please register my First Information Report (FIR).",
        "urgency": "Call 112 for immediate emergencies. File the FIR at the police station within 24 hours of the incident.",
        "next_step": "If the local police station refuses, send the complaint in writing to the Superintendent of Police (SP)."
    },
    "labour": {
        "primary_keys": ["labour"],
        "secondary_keys": ["court"],
        "reasons": {
            "labour": "Handles salary disputes, wrongful termination, and employer complaints.",
            "court": "For formal adjudication if conciliation at the Labour Office fails."
        },
        "helpline": "1800-11-6606",
        "portal": "https://samadhan.labour.gov.in",
        "required_documents": ["ID proof", "Employment contract or offer letter", "Salary slips or bank statements", "Termination letter (if any)"],
        "what_to_say": "I want to file a complaint against my employer for unpaid salary/wrongful termination. I have my employment records.",
        "urgency": "File the complaint as soon as possible, ideally within 6 months of the unpaid dues.",
        "next_step": "If conciliation fails, the Labour Commissioner will refer your case to the Labour Court for binding orders."
    },
    "women": {
        "primary_keys": ["women", "police"],
        "secondary_keys": ["court"],
        "reasons": {
            "women": "Specialized cell equipped to handle domestic violence and harassment sensitively.",
            "police": "For immediate physical protection and registering an FIR.",
            "court": "To file for protection orders, maintenance, or child custody."
        },
        "helpline": "181",
        "portal": "https://ncw.nic.in",
        "required_documents": ["ID proof", "Medical report (if applicable)", "Screenshots or recordings of abuse", "Marriage certificate (if domestic violence)"],
        "what_to_say": "I want to report a case of domestic violence/harassment. I need immediate legal protection and assistance.",
        "urgency": "Call Women Helpline 181 or 112 immediately for emergency rescue or assistance.",
        "next_step": "You can apply directly to the Magistrate for a Protection Order under the Domestic Violence Act."
    },
    "default": {
        "primary_keys": ["court"],
        "secondary_keys": ["police"],
        "reasons": {
            "court": "District Legal Services Authority provides free legal counsel and mediation.",
            "police": "First point of contact for any criminal grievance."
        },
        "helpline": "15100",
        "portal": "https://nalsa.gov.in",
        "required_documents": ["ID proof", "Any documents related to your legal issue", "Income certificate (for free legal aid)"],
        "what_to_say": "I need legal guidance regarding a dispute. I would like to request free legal assistance.",
        "urgency": "Reach out to the District Legal Services Authority (DLSA) at your earliest convenience.",
        "next_step": "Consult a lawyer or a DLSA representative to draft a formal legal strategy."
    }
}

CITY_ALIASES = {
    "bengaluru": "bangalore",
    "bombay": "mumbai",
    "madras": "chennai",
    "new delhi": "delhi",
    "hyd": "hyderabad",
}

ISSUE_TYPE_KEYWORDS = {
    "cybercrime": ["scam", "fraud", "hack", "phishing", "online", "cyber", "whatsapp", "upi", "otp", "bank fraud"],
    "consumer": ["product", "defective", "refund", "service", "company", "consumer", "purchase", "amazon", "flipkart"],
    "fir": ["theft", "assault", "robbery", "murder", "missing", "kidnap", "accident", "stolen", "beat", "attack", "crime"],
    "women": ["domestic violence", "dowry", "rape", "harassment", "stalking", "wife", "mahila", "molest", "women"],
    "labour": ["salary", "unpaid", "employer", "fired", "termination", "pf", "wages", "labour", "workplace"],
}
