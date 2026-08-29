"""CrewSense AI — Employee Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class EmployeeSkillOut(BaseModel):
    skillId: str = Field(alias="skill_id")
    proficiency: str  # strong / moderate / weak / missing
    yearsOfExperience: int = Field(alias="years_of_experience")

    class Config:
        from_attributes = True
        populate_by_name = True


class EmployeeCreate(BaseModel):
    id: Optional[str] = None
    name: str
    avatar: Optional[str] = None
    role: str
    department: str
    email: str
    capacity: int = 100
    skills: List[EmployeeSkillOut] = []


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    capacity: Optional[int] = None
    availability: Optional[str] = None


class EmployeeOut(BaseModel):
    id: str
    name: str
    avatar: str
    role: str
    department: str
    email: str
    skills: List[EmployeeSkillOut] = []
    currentProjects: List[str] = []
    visibleWorkload: int = 0
    shadowWorkload: int = 0
    effectiveWorkload: int = 0
    projectedWorkload: int = 0
    capacity: int = 100
    availability: str = "high"
    workloadStatus: str = "healthy"
    joinedDate: str = ""

    class Config:
        from_attributes = True
        populate_by_name = True
