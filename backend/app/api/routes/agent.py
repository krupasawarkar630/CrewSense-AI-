"""CrewSense AI — Autonomous Agent Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.risk import Risk
from app.schemas.common import ApiResponse
from app.schemas.agent import (
    AgentChatRequest,
    AgentChatResponseOut,
    AgentInsightOut,
    BuildTeamResponseOut,
)
from app.agent.orchestrator import agent_orchestrator
from app.services.project_service import project_service

router = APIRouter(prefix="/agent", tags=["Agent"])


@router.post("/chat", response_model=ApiResponse[AgentChatResponseOut])
async def agent_chat(
    req: AgentChatRequest,
    session: AsyncSession = Depends(get_db),
):
    """Ask CrewSense Agent anything about the team, projects, workload, or risk."""
    res = await agent_orchestrator.process_chat(
        message=req.message,
        session=session,
        conversation_id=req.conversation_id,
    )
    return ApiResponse.ok(res)


@router.get("/insights", response_model=ApiResponse[List[AgentInsightOut]])
async def get_agent_insights(session: AsyncSession = Depends(get_db)):
    """Retrieve real-time streaming insights detected by CrewSense Agent."""
    risk_res = await session.execute(select(Risk).where(Risk.is_active == True))
    risks = list(risk_res.scalars().all())

    insights = []
    for r in risks:
        insights.append(AgentInsightOut(
            id=f"insight-{r.id}",
            severity=r.severity if r.severity in ("critical", "warning", "info", "success") else "warning",
            title=r.title,
            description=r.description or "",
            category=r.category,
            relatedEntityId=r.affected_project_id or r.affected_employee_id or r.affected_task_id,
            actionLabel="View Analysis",
            actionRoute="/manager/agent",
            timestamp=r.detected_at.isoformat(),
        ))

    return ApiResponse.ok(insights)


@router.post("/build-team", response_model=ApiResponse[BuildTeamResponseOut])
async def agent_build_team(
    project_id: str = "proj-apollo",
    session: AsyncSession = Depends(get_db),
):
    """Autonomous agent team builder."""
    res = await project_service.build_team(session, project_id)
    return ApiResponse.ok(res)
