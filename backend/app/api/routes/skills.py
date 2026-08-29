"""CrewSense AI — Skill Matrix & Intelligence Routes."""

from __future__ import annotations

from typing import Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.skill import Skill
from app.models.employee import Employee
from app.schemas.common import ApiResponse
from app.schemas.skill import SkillOut, SkillMatrixEntryOut, SkillGapOut
from app.intelligence.skill_engine import detect_skill_gaps

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=ApiResponse[List[SkillOut]])
async def list_skills(session: AsyncSession = Depends(get_db)):
    """List all tracked organization skills."""
    result = await session.execute(select(Skill))
    skills = list(result.scalars().all())
    return ApiResponse.ok([SkillOut.from_orm(s) for s in skills])


@router.get("/matrix", response_model=ApiResponse[List[SkillMatrixEntryOut]])
async def get_skill_matrix(session: AsyncSession = Depends(get_db)):
    """Retrieve full employee vs skill matrix."""
    emp_res = await session.execute(select(Employee))
    employees = list(emp_res.scalars().all())

    skill_res = await session.execute(select(Skill))
    skills = list(skill_res.scalars().all())

    matrix = []
    for emp in employees:
        emp_skills_map: Dict[str, str] = {}
        for s in skills:
            es = next((item for item in (emp.skills or []) if item.skill_id == s.id), None)
            emp_skills_map[s.id] = es.proficiency if es else "missing"

        matrix.append(SkillMatrixEntryOut(
            employeeId=emp.id,
            employeeName=emp.name,
            skills=emp_skills_map,
        ))

    return ApiResponse.ok(matrix)


@router.get("/gaps", response_model=ApiResponse[List[SkillGapOut]])
async def get_skill_gaps(session: AsyncSession = Depends(get_db)):
    """Detect current organizational skill gaps and single points of failure."""
    emp_res = await session.execute(select(Employee))
    employees = list(emp_res.scalars().all())

    gaps = detect_skill_gaps(
        required_skills=["Marketing Automation", "Kubernetes", "GraphQL", "Cybersecurity"],
        all_employees=employees,
    )
    return ApiResponse.ok([SkillGapOut(**g) for g in gaps])
