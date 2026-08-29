"""CrewSense AI — Simulation & Agent API Tests."""

import pytest


@pytest.mark.asyncio
async def test_simulation_api(client):
    response = await client.post("/api/v1/simulations", json={
        "scenario": "Move Payment Integration from Rahul to Priya",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "comparison" in data["data"]
    assert data["data"]["comparison"]["proposed"]["delayProbabilityAfter"] < data["data"]["comparison"]["current"]["delayProbabilityBefore"]


@pytest.mark.asyncio
async def test_agent_chat_api(client):
    response = await client.post("/api/v1/agent/chat", json={
        "message": "Who is overloaded?",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Rahul" in data["data"]["message"]["content"]
