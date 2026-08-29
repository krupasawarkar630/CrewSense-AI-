"""CrewSense AI — Project & Team Builder Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_manager
from app.schemas.common import ApiResponse
from app.schemas.project import ProjectOut, ProjectCreate, ProjectUpdate, ProjectHealthOut
from app.schemas.agent import BuildTeamResponseOut
from app.services.project_service import project_service

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ApiResponse[List[ProjectOut]])
async def list_projects(session: AsyncSession = Depends(get_db)):
    """List all projects with health scores and delivery risks."""
    projects = await project_service.get_all_projects(session)
    return ApiResponse.ok(projects)


@router.get("/{project_id}", response_model=ApiResponse[ProjectOut])
async def get_project(project_id: str, session: AsyncSession = Depends(get_db)):
    """Get project details, member allocations, and critical path."""
    project = await project_service.get_project_by_id(session, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )
    return ApiResponse.ok(project)


@router.post("/{project_id}/build-team", response_model=ApiResponse[BuildTeamResponseOut])
async def build_team_for_project(
    project_id: str,
    session: AsyncSession = Depends(get_db),
):
    """Run AI team builder for project requirements."""
    res = await project_service.build_team(session, project_id)
    return ApiResponse.ok(res)
