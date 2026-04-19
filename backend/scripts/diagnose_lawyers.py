import struct
import binascii
from app.services.lawyer_service import LawyerService
import asyncio

async def diagnose():
    service = LawyerService()
    supabase = service._load_supabase()
    if not supabase:
        print("Supabase not loaded")
        return

    res = supabase.table("lawyers").select("full_name, location").execute()
    for row in res.data:
        name = row['full_name']
        hex_data = row['location']
        binary_data = binascii.unhexlify(hex_data)
        
        # PostGIS EWKB: [Endian:1][Type:4][SRID:4][X:8][Y:8]
        # 01 01 00 00 20 E6 10 00 00 ...
        # Endian: 01 (Little)
        # Type: 01 00 00 20 (Point + SRID)
        # SRID: E6 10 00 00 (4326)
        
        # Little-endian unpack starting from byte 9 (after 1+4+4 bytes)
        try:
            longitude, latitude = struct.unpack('<dd', binary_data[9:25])
            print(f"Lawyer: {name}")
            print(f"  Coordinates: Longitude={longitude}, Latitude={latitude}")
        except Exception as e:
            print(f"  Error parsing {hex_data}: {e}")

    print("\nTesting RPC 'find_nearby_lawyers' with Lucknow center:")
    rpc_res = supabase.rpc("find_nearby_lawyers", {
        "user_lat": 26.8467,
        "user_lng": 80.9462,
        "radius_km": 10000,
        "case_type": "All"
    }).execute()
    print(f"Results: {len(rpc_res.data)} found")
    for r in rpc_res.data:
        print(f"  - {r['full_name']} at {r['distance_km']:.2f} km")

if __name__ == "__main__":
    asyncio.run(diagnose())
