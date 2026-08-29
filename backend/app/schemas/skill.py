"""CrewSense AI — Skill Schemas."""

from __future__ import annotations

from typing import Dict, List, Optional
from pydantic import BaseModel


class SkillOut(BaseModel):
    id: str
    name: str
    category: str
    demand: int = 0

    class Config:
        from_attributes = True


class SkillMatrixEntryOut(BaseModel):
    employeeId: str
    employeeName: str
    skills: Dict[str, str]  # skillId -> proficiency (strong, moderate, weak, missing)


class SkillGapSolutionOut(BaseModel):
    type: str  # partial_match / add_capacity / change_requirement
    description: str
    employeeId: Optional[str] = None
    matchPercent: Optional[int] = None
    impact: str


class PartialMatchOut(BaseModel):
    employeeId: str
    matchPercent: int


class SkillGapOut(BaseModel):
    skillName: str
    qualifiedEmployees: int
    partialMatches: List[PartialMatchOut] = []
    solutions: List[SkillGapSolutionOut] = []
