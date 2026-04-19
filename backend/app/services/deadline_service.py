from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.models.extended_schemas import DeadlineResponse

class DeadlineService:
    LIMITATION_PERIODS = {
        "consumer_complaint": {"days": 730, "law": "Consumer Protection Act 2019 - Section 69"},
        "fir": {"days": 0, "law": "Cognizable Offence (No strict limit, but immediate action required)"},
        "civil_suit": {"days": 1095, "law": "Limitation Act 1963 (General Period)"},
        "cheque_bounce": {"days": 30, "law": "Negotiable Instruments Act - Section 138"},
        "rti_application": {"days": 30, "law": "RTI Act 2005 (Response Window)"},
        "labour_dispute": {"days": 1095, "law": "Industrial Disputes Act"}
    }

    async def calculate_deadline(self, case_type: str, incident_date_str: str, jurisdiction: Optional[str] = None) -> DeadlineResponse:
        incident_date = datetime.fromisoformat(incident_date_str)
        period_data = self.LIMITATION_PERIODS.get(case_type, {"days": 365, "law": "General Statutory Provision"})
        
        limitation_days = period_data["days"]
        applicable_law = period_data["law"]
        
        # FIR and RTI have special handling as per prompt
        if case_type == "fir":
            filing_deadline = "Promptly / As soon as possible"
            days_remaining = 0
            warning_status = "urgent"
            recommended_actions = [
                "Visit the nearest police station immediately",
                "Keep all evidence and witness details ready",
                "Request a signed copy of the FIR"
            ]
        elif case_type == "rti":
            filing_deadline = "No fixed deadline (30-day response window applies)"
            days_remaining = 30
            warning_status = "safe"
            recommended_actions = [
                "Draft the RTI application clearly",
                "Pay the required fee",
                "Send via Registered Post for proof"
            ]
        else:
            deadline_date = incident_date + timedelta(days=limitation_days)
            if case_type == "cheque_bounce":
                # Special logic: 30 days after 15-day notice period
                deadline_date = incident_date + timedelta(days=15 + 30)
            
            days_remaining = (deadline_date - datetime.now()).days
            filing_deadline = deadline_date.strftime("%Y-%m-%d")
            
            if days_remaining < 0:
                warning_status = "expired"
            elif days_remaining < 7:
                warning_status = "critical"
            elif days_remaining < 30:
                warning_status = "urgent"
            else:
                warning_status = "safe"
                
            recommended_actions = self._get_recommendations(case_type, warning_status)

        return DeadlineResponse(
            filing_deadline=filing_deadline,
            days_remaining=max(0, days_remaining),
            limitation_period_days=limitation_days,
            applicable_law=applicable_law,
            warning_status=warning_status,
            recommended_actions=recommended_actions
        )

    def _get_recommendations(self, case_type: str, status: str) -> List[str]:
        base = ["Consult a lawyer immediately", "Gather all relevant documentation"]
        if status == "critical":
            base = ["Contact a lawyer within 24 hours", "Prepare a draft petition immediately"]
        elif status == "expired":
            base = ["Consult a lawyer regarding condonation of delay (Section 5 Limitation Act)", "Analyze if there is a continuing cause of action"]
            
        if case_type == "consumer_complaint":
            base.append("Collect all invoices and warranty cards")
        elif case_type == "cheque_bounce":
            base.append("Ensure the 15-day notice period has elapsed")
            
        return base
