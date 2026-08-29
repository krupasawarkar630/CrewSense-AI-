"""CrewSense AI — Dashboard Intelligence Routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.employee import Employee
from app.models.project import Project
from app.models.task import Task
from app.schemas.common import ApiResponse
from app.schemas.dashboard import DashboardKPIsOut
from app.services.employee_service import employee_service
from app.services.project_service import project_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis", response_model=ApiResponse[DashboardKPIsOut])
async def get_dashboard_kpis(session: AsyncSession = Depends(get_db)):
    """Calculate executive overview KPIs for the Manager Dashboard."""
    emp_res = await employee_service.get_all_employees(session)
    proj_res = await project_service.get_all_projects(session)

    task_count_res = await session.execute(
        select(func.count(Task.id)).where(Task.status != "done")
    )
    active_tasks = task_count_res.scalar() or 0

    active_projects = sum(1 for p in proj_res if p.status != "completed")
    overloaded = sum(1 for e in emp_res if e.workloadStatus == "overloaded")
    at_risk = sum(1 for p in proj_res if p.riskLevel in ("high", "critical"))

    avg_capacity = 0
    if emp_res:
        avg_capacity = int(round(sum(max(0, 100 - e.effectiveWorkload) for e in emp_res) / len(emp_res)))

    kpis = DashboardKPIsOut(
        teamMembers=len(emp_res),
        activeProjects=active_projects,
        activeTasks=active_tasks,
        availableCapacity=avg_capacity,
        overloaded=overloaded,
        atRiskProjects=at_risk,
    )
    return ApiResponse.ok(kpis)
