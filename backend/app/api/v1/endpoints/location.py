from fastapi import APIRouter, HTTPException
from loguru import logger
from app.models.schemas import NearbyPlacesRequest, NearbyPlacesResponse
from app.services.osm_location_service import OSMLocationService

router = APIRouter()
osm_location_service = OSMLocationService()

@router.post("/get-nearby-legal-services", response_model=NearbyPlacesResponse)
async def get_nearby_legal_services(request: NearbyPlacesRequest):
    """
    Extracts location from user query and fetches nearby legal services using OpenStreetMap.
    """
    try:
        # 1. NLP Location Extraction
        location_name = await osm_location_service.extract_location(request.query)
        
        if not location_name:
            # Require manual location input if NLP fails
            return NearbyPlacesResponse(requires_location_input=True)
            
        # 2. Geocoding
        coordinates = await osm_location_service.geocode(location_name)
        
        if not coordinates:
            # Cannot find coordinates for extracted location
            return NearbyPlacesResponse(
                location_detected=location_name,
                requires_location_input=True
            )
            
        lat, lon = coordinates
        
        # 3. Fetch Nearby Services
        places = await osm_location_service.fetch_nearby(lat, lon, radius_km=30)
        
        # 4. Return Structured Response
        return NearbyPlacesResponse(
            location_detected=location_name,
            requires_location_input=False,
            police_stations=places.get("police_stations", []),
            courts=places.get("courts", []),
            legal_services=places.get("legal_services", [])
        )
        
    except Exception as e:
        logger.error(f"Error in get_nearby_legal_services: {e}")
        # Return graceful fallback instead of breaking
        return NearbyPlacesResponse(requires_location_input=True)
