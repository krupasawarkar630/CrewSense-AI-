"""CrewSense AI — Risk Intelligence Routes."""

from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.risk import Risk
from app.schemas.common import ApiResponse
from app.schemas.risk import RiskOut

router = APIRouter(prefix="/risks", tags=["Risks"])


@router.get("", response_model=ApiResponse[List[RiskOut]])
async def list_risks(session: AsyncSession = Depends(get_db)):
    """List all detected delivery, workload, dependency, and capacity risks."""
    result = await session.execute(select(Risk).where(Risk.is_active == True))
    risks = list(result.scalars().all())

    return ApiResponse.ok([
        RiskOut(
            id=r.id,
            category=r.category,
            severity=r.severity,
            title=r.title,
            description=r.description or "",
            affectedProjectId=r.affected_project_id,
            affectedEmployeeId=r.affected_employee_id,
            affectedTaskId=r.affected_task_id,
            probability=r.probability,
            impact=r.impact or "",
            detectedAt=r.detected_at.isoformat(),
            recommendation=r.recommendation,
        )
        for r in risks
    ])
