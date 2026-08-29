"""CrewSense AI — System Health Checks."""

from __future__ import annotations

from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_graph_client
from app.db.neo4j import GraphClient
from app.agent.groq_provider import groq_provider
from app.agent.gemini_provider import gemini_provider
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/health", tags=["Health Checks"])


@router.get("", response_model=ApiResponse[Dict[str, Any]])
async def health_check():
    """Overall system health status."""
    return ApiResponse.ok({
        "status": "healthy",
        "service": "CrewSense AI Backend",
        "version": "1.0.0",
    })


@router.get("/database", response_model=ApiResponse[Dict[str, Any]])
async def database_health(session: AsyncSession = Depends(get_db)):
    """PostgreSQL database connectivity check."""
    try:
        await session.execute(text("SELECT 1"))
        return ApiResponse.ok({"status": "connected", "database": "PostgreSQL"})
    except Exception as exc:
        return ApiResponse.ok({"status": "degraded", "error": str(exc)})


@router.get("/neo4j", response_model=ApiResponse[Dict[str, Any]])
async def neo4j_health(graph: GraphClient = Depends(get_graph_client)):
    """Neo4j graph database connectivity check."""
    status = "connected" if graph.is_connected else "fallback_mode"
    return ApiResponse.ok({
        "status": status,
        "database": "Neo4j Graph",
        "is_connected": graph.is_connected,
    })


@router.get("/ai", response_model=ApiResponse[Dict[str, Any]])
async def ai_providers_health():
    """Groq & Gemini AI provider availability check."""
    return ApiResponse.ok({
        "groq": "available" if groq_provider.is_available else "not_configured",
        "gemini": "available" if gemini_provider.is_available else "not_configured",
        "deterministic_engine": "operational",
    })
