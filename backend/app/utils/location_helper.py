"""
Location Helper — LexisCo
Infers legal authority suggestions based on city and issue type.
Fail-safe: always returns None if no match, never raises exceptions.
"""

from loguru import logger
import urllib.parse
from app.utils.location_data import LOCATION_DATA, ISSUE_MAPPING, CITY_ALIASES, ISSUE_TYPE_KEYWORDS

def _normalize_city(city: str) -> str:
    """Normalize city name to a known key."""
    if not city:
        return ""
    city_lower = city.strip().lower()
    
    # Direct match
    if city_lower in LOCATION_DATA:
        return city_lower
    # Alias match
    if city_lower in CITY_ALIASES:
        return CITY_ALIASES[city_lower]
    
    # Partial match (e.g., "new delhi, india" -> "delhi")
    for known_city in LOCATION_DATA:
        if known_city in city_lower:
            return known_city
            
    return ""

def _infer_issue_type(query: str, doc_type: str = "") -> str:
    """Infer the issue type from query text."""
    if doc_type:
        dt = doc_type.lower()
        if "cyber" in dt: return "cybercrime"
        if "consumer" in dt: return "consumer"
        if "fir" in dt: return "fir"
        
    if not query:
        return "default"
        
    q = query.lower()
    for issue_type, keywords in ISSUE_TYPE_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return issue_type

    return "default"

def _create_maps_link(place_name: str, city: str) -> str:
    query = urllib.parse.quote_plus(f"{place_name} {city}")
    return f"https://www.google.com/maps/search/{query}"

def get_location_guidance(city: str, query: str = "", doc_type: str = "") -> dict:
    """
    Returns primary/secondary places and actionable info based on city and query.
    Fail-safe: returns None if city not found.
    """
    try:
        if not city:
            return None

        normalized_city = _normalize_city(city)
        if not normalized_city:
            return None

        issue_type = _infer_issue_type(query, doc_type)
        city_data = LOCATION_DATA[normalized_city]
        issue_data = ISSUE_MAPPING.get(issue_type, ISSUE_MAPPING["default"])

        response = {
            "issue_type": issue_type,
            "primary_authorities": [],
            "secondary_authorities": [],
            "helpline": issue_data["helpline"],
            "online_option": issue_data["portal"],
            "required_documents": issue_data["required_documents"],
            "what_to_say": issue_data["what_to_say"],
            "urgency": issue_data["urgency"],
            "next_step": issue_data.get("next_step", "Seek legal counsel for further escalation.")
        }

        def populate_authorities(target_list, keys_list):
            for key in keys_list:
                if key in city_data:
                    reason_text = issue_data["reasons"].get(key, "Relevant authority for your issue.")
                    # Only take the first 2 places to prevent clutter
                    for place in city_data[key][:2]:
                        type_str = "court" if key == "court" else f"{key}_station" if key == "police" else f"{key}_office"
                        if key == "consumer": type_str = "consumer_forum"
                        
                        target_list.append({
                            "name": place,
                            "type": type_str,
                            "reason": reason_text,
                            "maps": _create_maps_link(place, normalized_city)
                        })

        populate_authorities(response["primary_authorities"], issue_data.get("primary_keys", []))
        populate_authorities(response["secondary_authorities"], issue_data.get("secondary_keys", []))

        return response

    except Exception as e:
        logger.warning(f"Location guidance failed silently: {e}")
        return None
