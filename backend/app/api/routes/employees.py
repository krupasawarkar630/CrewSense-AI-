"""CrewSense AI — Employee Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_manager
from app.schemas.common import ApiResponse
from app.schemas.employee import EmployeeOut, EmployeeCreate, EmployeeUpdate
from app.services.employee_service import employee_service

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=ApiResponse[List[EmployeeOut]])
async def list_employees(session: AsyncSession = Depends(get_db)):
    """List all team members with calculated effective workload and capacity."""
    employees = await employee_service.get_all_employees(session)
    return ApiResponse.ok(employees)


@router.get("/{employee_id}", response_model=ApiResponse[EmployeeOut])
async def get_employee(employee_id: str, session: AsyncSession = Depends(get_db)):
    """Get single employee detail with full intelligence."""
    emp = await employee_service.get_employee_by_id(session, employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found",
        )
    return ApiResponse.ok(emp)
