"""CrewSense AI — Task Management Routes."""

from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_manager
from app.schemas.common import ApiResponse
from app.schemas.task import TaskOut, TaskCreate, TaskUpdate, TaskAssignRequest
from app.services.task_service import task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=ApiResponse[List[TaskOut]])
async def list_tasks(
    project_id: Optional[str] = Query(None, alias="projectId"),
    assignee_id: Optional[str] = Query(None, alias="assigneeId"),
    session: AsyncSession = Depends(get_db),
):
    """List tasks filtered by project or assignee."""
    tasks = await task_service.get_all_tasks(session, project_id=project_id, assignee_id=assignee_id)
    return ApiResponse.ok(tasks)


@router.post("/{task_id}/assign", response_model=ApiResponse[TaskOut])
async def assign_task(
    task_id: str,
    req: TaskAssignRequest,
    session: AsyncSession = Depends(get_db),
):
    """Assign or reassign task to an employee and sync to Neo4j."""
    updated = await task_service.assign_task(session, task_id, req.employeeId)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )
    return ApiResponse.ok(updated)


@router.post("/{task_id}/reassign", response_model=ApiResponse[TaskOut])
async def reassign_task(
    task_id: str,
    req: TaskAssignRequest,
    session: AsyncSession = Depends(get_db),
):
    """Reassign task with automatic workload recalculation."""
    return await assign_task(task_id, req, session)
