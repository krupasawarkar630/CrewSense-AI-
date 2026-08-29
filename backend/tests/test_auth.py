"""CrewSense AI — Auth Tests."""

import pytest


@pytest.mark.asyncio
async def test_demo_login_success(client):
    response = await client.post("/api/v1/auth/login", json={
        "email": "alex@crewsense.ai",
        "password": "demo123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["role"] == "manager"


@pytest.mark.asyncio
async def test_login_invalid_password(client):
    response = await client.post("/api/v1/auth/login", json={
        "email": "unknown@crewsense.ai",
        "password": "wrongpassword999",
    })
    assert response.status_code == 401
