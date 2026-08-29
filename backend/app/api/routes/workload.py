"""CrewSense AI — Workload Intelligence Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.common import ApiResponse
from app.schemas.employee import EmployeeOut
from app.services.employee_service import employee_service

router = APIRouter(prefix="/workload", tags=["Workload"])


@router.get("", response_model=ApiResponse[List[EmployeeOut]])
async def get_team_workload(session: AsyncSession = Depends(get_db)):
    """Retrieve full team visible vs shadow workload breakdowns."""
    employees = await employee_service.get_all_employees(session)
    return ApiResponse.ok(employees)


@router.get("/{employee_id}", response_model=ApiResponse[EmployeeOut])
async def get_employee_workload(employee_id: str, session: AsyncSession = Depends(get_db)):
    """Retrieve detailed capacity and workload analytics for a specific employee."""
    emp = await employee_service.get_employee_by_id(session, employee_id)
    return ApiResponse.ok(emp)
