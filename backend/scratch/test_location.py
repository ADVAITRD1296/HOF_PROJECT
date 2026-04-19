import asyncio
from app.utils.location_helper import get_location_guidance

def test_location():
    print("--- Test 1: Known City, Cybercrime ---")
    res1 = get_location_guidance(city="Lucknow", query="I was scammed online")
    print(res1)
    print("\n")

    print("--- Test 2: Unknown City, Property Dispute (Dynamic Fallback) ---")
    res2 = get_location_guidance(city="Solapur", query="My landlord is trying to evict me")
    print(res2)
    print("\n")

    print("--- Test 3: Known City, New Issue Type (Women's Safety) ---")
    res3 = get_location_guidance(city="Delhi", query="domestic violence complaint")
    print(res3)
    print("\n")

if __name__ == "__main__":
    test_location()
