#!/usr/bin/env python3
"""
Quick diagnostic script to test signup endpoint
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_signup():
    print("🧪 Testing Signup Endpoint...\n")

    # Test data
    signup_data = {
        "email": "debug@test.com",
        "username": "debuguser",
        "password": "Debug1234",
        "full_name": "Debug User"
    }

    print(f"📤 Sending POST to {BASE_URL}/api/auth/signup")
    print(f"📦 Data: {json.dumps(signup_data, indent=2)}\n")

    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )

        print(f"📥 Response Status: {response.status_code}")
        print(f"📦 Response Body:")
        print(json.dumps(response.json(), indent=2))

        if response.status_code == 201:
            data = response.json()
            if "access_token" in data and "refresh_token" in data:
                print("\n✅ SUCCESS! Signup returns tokens correctly.")
                print(f"   - Access Token: {data['access_token'][:20]}...")
                print(f"   - Refresh Token: {data['refresh_token'][:20]}...")
                print(f"   - User: {data['user']['email']}")
                return True
            else:
                print("\n❌ ISSUE: Response missing tokens")
                return False
        else:
            print(f"\n❌ FAILED: Status {response.status_code}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to backend!")
        print("   Make sure backend is running: uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_backend_health():
    print("🏥 Testing Backend Health...\n")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except:
        print("❌ Backend not responding!\n")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("AIRA Signup Diagnostic Tool")
    print("=" * 60)
    print()

    # Test 1: Backend health
    if not test_backend_health():
        print("\n⚠️  Start backend first: cd backend && uvicorn main:app --reload")
        exit(1)

    # Test 2: Signup endpoint
    if test_signup():
        print("\n✅ All tests passed! Signup should work.")
    else:
        print("\n❌ Signup test failed. See errors above.")
