import httpx
import math
import json
from loguru import logger
from typing import Optional, Dict, Any, List, Tuple
from app.core.config import settings

try:
    from groq import Groq
except ImportError:
    Groq = None

# Simple in-memory caches
GEOCODE_CACHE = {}
OVERPASS_CACHE = {}

class OSMLocationService:
    def __init__(self):
        self._groq_client = None
        self.headers = {
            "User-Agent": "LexisCo/1.0 (contact@lexisco.com)"
        }

    def _load_groq_client(self):
        if self._groq_client is None:
            if settings.GROQ_API_KEY and Groq:
                self._groq_client = Groq(api_key=settings.GROQ_API_KEY)
        return self._groq_client

    async def extract_location(self, query: str) -> Optional[str]:
        """Extract Indian city/town/location from text using Groq LLM."""
        groq_client = self._load_groq_client()
        if not groq_client:
            logger.warning("Groq client not available for location extraction.")
            return None

        prompt = f"""
        Extract ONLY the primary location (city, town, or specific area) from the following query. 
        The location should be in India.
        If no location is explicitly mentioned, return "NONE".
        Do not explain, just return the location string or "NONE".
        
        Query: "{query}"
        """
        
        try:
            chat_completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=20,
            )
            result = chat_completion.choices[0].message.content.strip()
            
            if result.upper() == "NONE" or not result:
                return None
            return result
        except Exception as e:
            logger.error(f"Error extracting location: {e}")
            return None

    async def geocode(self, location_name: str) -> Optional[Tuple[float, float]]:
        """Convert location name to latitude and longitude using Nominatim."""
        if not location_name:
            return None
            
        location_lower = location_name.lower().strip()
        if location_lower in GEOCODE_CACHE:
            return GEOCODE_CACHE[location_lower]
            
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": location_name + ", India",
            "format": "json",
            "limit": 1
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self.headers, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                
                if data and len(data) > 0:
                    lat = float(data[0]["lat"])
                    lon = float(data[0]["lon"])
                    GEOCODE_CACHE[location_lower] = (lat, lon)
                    return (lat, lon)
                return None
        except Exception as e:
            logger.error(f"Geocoding error for {location_name}: {e}")
            return None

    def _haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance between two points in km."""
        R = 6371.0 # Earth radius in kilometers
        
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        
        a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance

    def _format_address(self, tags: dict) -> str:
        """Format an address from OSM tags."""
        parts = []
        if "addr:housenumber" in tags and "addr:street" in tags:
            parts.append(f"{tags['addr:housenumber']} {tags['addr:street']}")
        elif "addr:street" in tags:
            parts.append(tags["addr:street"])
            
        if "addr:suburb" in tags:
            parts.append(tags["addr:suburb"])
        if "addr:city" in tags:
            parts.append(tags["addr:city"])
        elif "addr:town" in tags:
            parts.append(tags["addr:town"])
            
        if "addr:state" in tags:
            parts.append(tags["addr:state"])
            
        if "addr:postcode" in tags:
            parts.append(tags["addr:postcode"])
            
        if not parts:
            return "Address not available"
        return ", ".join(parts)

    async def fetch_nearby(self, lat: float, lon: float, radius_km: int = 20) -> Dict[str, List[Dict]]:
        """Fetch nearby police stations, courts, and lawyers using Overpass API."""
        cache_key = f"{round(lat, 3)}_{round(lon, 3)}_{radius_km}"
        if cache_key in OVERPASS_CACHE:
            return OVERPASS_CACHE[cache_key]
            
        radius_m = radius_km * 1000
        
        # Overpass query to get all categories (Nodes, Ways, and Relations)
        # Includes notaries as they are essential legal services in India
        query = f"""
        [out:json][timeout:30];
        (
          nwr["amenity"="police"](around:{radius_m},{lat},{lon});
          nwr["amenity"="courthouse"](around:{radius_m},{lat},{lon});
          nwr["office"="lawyer"](around:{radius_m},{lat},{lon});
          nwr["office"="notary"](around:{radius_m},{lat},{lon});
          nwr["government"="justice"](around:{radius_m},{lat},{lon});
        );
        out center;
        """
        
        url = "https://overpass-api.de/api/interpreter"
        
        police_stations = []
        courts = []
        legal_services = []
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, data={"data": query}, headers=self.headers, timeout=25.0)
                response.raise_for_status()
                data = response.json()
                
                for element in data.get("elements", []):
                    tags = element.get("tags", {})
                    
                    # For ways/relations, Overpass 'out center' provides center lat/lon
                    e_lat = element.get("lat") or element.get("center", {}).get("lat")
                    e_lon = element.get("lon") or element.get("center", {}).get("lon")
                    
                    if e_lat is None or e_lon is None:
                        continue
                        
                    distance = round(self._haversine(lat, lon, float(e_lat), float(e_lon)), 2)
                    
                    name = tags.get("name") or tags.get("name:en")
                    if not name:
                        if tags.get("amenity") == "police": name = "Police Station"
                        elif tags.get("amenity") == "courthouse": name = "Court"
                        elif tags.get("office") == "lawyer": name = "Lawyer/Legal Office"
                        else: name = "Legal Service"
                        
                    address = self._format_address(tags)
                    map_link = f"https://www.openstreetmap.org/?mlat={e_lat}&mlon={e_lon}#map=18/{e_lat}/{e_lon}"
                    
                    place_info = {
                        "name": name,
                        "address": address,
                        "latitude": float(e_lat),
                        "longitude": float(e_lon),
                        "distance_km": distance,
                        "map_link": map_link
                    }
                    
                    if tags.get("amenity") == "police":
                        police_stations.append(place_info)
                    elif tags.get("amenity") == "courthouse" or tags.get("government") == "justice":
                        courts.append(place_info)
                    elif tags.get("office") in ["lawyer", "notary"]:
                        legal_services.append(place_info)
                        
                # Sort by distance
                police_stations.sort(key=lambda x: x["distance_km"])
                courts.sort(key=lambda x: x["distance_km"])
                legal_services.sort(key=lambda x: x["distance_km"])
                
                result = {
                    "police_stations": police_stations[:5],
                    "courts": courts[:5],
                    "legal_services": legal_services[:5]
                }
                
                OVERPASS_CACHE[cache_key] = result
                return result
                
        except Exception as e:
            logger.error(f"Overpass API error: {e}")
            return {
                "police_stations": [],
                "courts": [],
                "legal_services": []
            }
