import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_deadline():
    print("\n--- Testing Deadline Calculator ---")
    payload = {
        "case_type": "consumer_complaint",
        "incident_date": "2024-01-01",
        "jurisdiction": "Mumbai"
    }
    res = requests.post(f"{BASE_URL}/deadline/calculate", json=payload)
    print(json.dumps(res.json(), indent=2))

def test_case_card():
    print("\n--- Testing Case Card Generation ---")
    payload = {
        "case_summary": "My employer has not paid my salary for 3 months despite multiple requests.",
        "applicable_law": "Payment of Wages Act",
        "steps": [
            {"step_number": 1, "title": "Send Notice", "description": "Send a formal notice to the employer."},
            {"step_number": 2, "title": "File Complaint", "description": "File a complaint with the Labour Commissioner."}
        ],
        "user_name": "Marcus"
    }
    res = requests.post(f"{BASE_URL}/case-card/generate", json=payload)
    data = res.json()
    print(json.dumps(data, indent=2))
    
    if data["success"]:
        card_id = data["data"]["unique_card_id"]
        print(f"\n--- Testing Case Card Retrieval ({card_id}) ---")
        res_get = requests.get(f"{BASE_URL}/case-card/{card_id}")
        print(json.dumps(res_get.json(), indent=2))

def test_case_strength():
    print("\n--- Testing Case Strength Analyzer ---")
    payload = {
        "case_description": "I have a written contract and bank statements showing I haven't been paid.",
        "evidence_list": ["Bank Statement", "Contract copy", "Email trail"],
        "witnesses": True,
        "documentation": True,
        "case_type": "civil_suit"
    }
    res = requests.post(f"{BASE_URL}/case-strength/analyze", json=payload)
    print(json.dumps(res.json(), indent=2))

def test_journey():
    print("\n--- Testing Journey Tracker ---")
    payload = {
        "user_id": "user_123",
        "case_type": "consumer_complaint",
        "problem_description": "Defective laptop delivered"
    }
    res = requests.post(f"{BASE_URL}/journey/create", json=payload)
    data = res.json()
    print(json.dumps(data, indent=2))
    
    if data["success"]:
        jid = data["data"]["journey_id"]
        print(f"\n--- Testing Journey Update ({jid}) ---")
        up_payload = {
            "step_name": "Problem Identified",
            "step_status": "completed",
            "notes": "Logged the issue with customer care"
        }
        res_up = requests.post(f"{BASE_URL}/journey/{jid}/update", json=up_payload)
        print(json.dumps(res_up.json(), indent=2))

if __name__ == "__main__":
    # Note: Backend must be running for these tests to work
    try:
        test_deadline()
        test_case_card()
        test_case_strength()
        test_journey()
    except Exception as e:
        print(f"Error during testing: {e}")
        print("Ensure 'uvicorn app.main:app' is running on port 8000.")
