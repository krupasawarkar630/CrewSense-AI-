"""CrewSense AI — Project Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    description: str = ""
    priority: str = "high"
    startDate: str = "2025-08-01"
    deadline: str = "2025-09-30"
    teamSize: Optional[str] = None
    roles: Optional[str] = None
    requiredSkills: List[str] = []
    budget: Optional[float] = None
    client: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress: Optional[int] = None
    deadline: Optional[str] = None


class ProjectOut(BaseModel):
    id: str
    name: str
    description: str
    status: str
    priority: str
    progress: int
    startDate: str
    deadline: str
    projectedCompletion: str
    delayProbability: int
    riskLevel: str
    teamMembers: List[str] = []
    taskIds: List[str] = []
    healthScore: int = 85
    requiredSkills: List[str] = []
    budget: Optional[float] = None
    client: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectHealthOut(BaseModel):
    projectId: str
    projectName: str
    healthScore: int
    delayProbability: int
    riskLevel: str
    teamSize: int
    taskCount: int
    criticalPathLength: int
    bottleneckCount: int
