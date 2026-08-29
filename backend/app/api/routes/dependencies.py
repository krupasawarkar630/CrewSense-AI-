"""CrewSense AI — Dependency Graph & Critical Path Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.task import Task, TaskDependency
from app.models.employee import Employee
from app.schemas.common import ApiResponse
from app.schemas.dependency import DependencyOut, CriticalPathOut, BottleneckOut
from app.intelligence.critical_path_engine import calculate_critical_path
from app.intelligence.bottleneck_engine import detect_bottlenecks

router = APIRouter(prefix="/dependencies", tags=["Dependencies"])


@router.get("", response_model=ApiResponse[List[DependencyOut]])
async def list_all_dependencies(session: AsyncSession = Depends(get_db)):
    """List all task-to-task dependency relationships."""
    result = await session.execute(select(TaskDependency))
    deps = list(result.scalars().all())

    return ApiResponse.ok([
        DependencyOut(
            id=d.id,
            sourceTaskId=d.source_task_id,
            targetTaskId=d.target_task_id,
            type=d.type,
            isCritical=d.is_critical,
            status=d.status,
            impact=d.impact or "",
        )
        for d in deps
    ])


@router.get("/critical-path/{project_id}", response_model=ApiResponse[CriticalPathOut])
async def get_project_critical_path(
    project_id: str,
    session: AsyncSession = Depends(get_db),
):
    """Calculate and return project critical path DAG and bottlenecks."""
    task_res = await session.execute(select(Task).where(Task.project_id == project_id))
    tasks = list(task_res.scalars().all())

    dep_res = await session.execute(select(TaskDependency))
    dependencies = list(dep_res.scalars().all())

    emp_res = await session.execute(select(Employee))
    employees = list(emp_res.scalars().all())

    res = calculate_critical_path(
        project_id=project_id,
        tasks=tasks,
        dependencies=dependencies,
        employees=employees,
    )
    return ApiResponse.ok(CriticalPathOut(**res))


@router.get("/bottlenecks", response_model=ApiResponse[List[BottleneckOut]])
async def list_bottlenecks(session: AsyncSession = Depends(get_db)):
    """Identify organizational bottlenecks and single points of failure."""
    emp_res = await session.execute(select(Employee))
    employees = list(emp_res.scalars().all())

    task_res = await session.execute(select(Task))
    tasks = list(task_res.scalars().all())

    dep_res = await session.execute(select(TaskDependency))
    dependencies = list(dep_res.scalars().all())

    bottlenecks = detect_bottlenecks(employees, tasks, dependencies)
    return ApiResponse.ok([BottleneckOut(**b) for b in bottlenecks])
