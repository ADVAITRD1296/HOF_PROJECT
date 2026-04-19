import asyncio
from app.models.schemas import LawyerRegistrationRequest
from app.services.lawyer_service import LawyerService

async def main():
    service = LawyerService()
    req = LawyerRegistrationRequest(
        full_name="Advait Deshpande",
        phone="9876543210",
        email="advait.law@example.com",
        bar_council_id="MAH/1234/2026",
        practice_areas=["Criminal", "Cybercrime", "Corporate"],
        experience_years=5,
        office_address="123 Justice Lane",
        city="Mumbai",
        pincode="400001",
        availability="Both",
        consultation_fee=1500.0,
        latitude=18.9220,
        longitude=72.8347
    )
    try:
        res = await service.register_lawyer(req)
        print("Success:", res)
    except Exception as e:
        print("Error from Supabase:", e)

asyncio.run(main())
