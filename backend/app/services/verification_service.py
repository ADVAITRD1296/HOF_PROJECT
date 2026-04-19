import json
from loguru import logger
from typing import Optional
from app.core.config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

class VerificationService:
    def __init__(self):
        self._groq_client = None
        if settings.GROQ_API_KEY and Groq:
            self._groq_client = Groq(api_key=settings.GROQ_API_KEY)

    async def verify_id_name_match(self, extracted_text: str, user_name: str) -> bool:
        """
        Uses LLM to verify if the name extracted via OCR matches the registered user name.
        Handles variations in spelling, initials, etc.
        """
        if not self._groq_client:
            logger.warning("Groq client not available for ID verification. Falling back to simple check.")
            return user_name.lower() in extracted_text.lower()

        prompt = f"""
        Compare the following two names. Name A is extracted from a government ID via OCR. 
        Name B is provided by the user during registration.
        Does Name A match Name B? (Allow minor typos or different orders like First Last vs Last First).

        Name A (Extracted): "{extracted_text}"
        Name B (Registered): "{user_name}"

        Respond ONLY in JSON format:
        {{"match": true/false, "confidence": 0-1.0}}
        """

        try:
            chat_completion = self._groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            result = json.loads(chat_completion.choices[0].message.content)
            return result.get("match", False) and result.get("confidence", 0) > 0.7
        except Exception as e:
            logger.error(f"Error in AI name verification: {e}")
            return user_name.lower() in extracted_text.lower()

    async def validate_bar_id_format(self, bar_number: str) -> bool:
        """
        Validates the format of a State Bar Council enrollment number (e.g., MAH/1234/2026).
        """
        import re
        pattern = r"^[A-Z]{2,3}/\d+/\d{4}$" # Simple pattern for StateCode/Number/Year
        return bool(re.match(pattern, bar_number.upper()))
