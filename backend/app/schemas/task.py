"""CrewSense AI — Task Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    id: Optional[str] = None
    title: str
    description: str = ""
    projectId: str
    assigneeId: Optional[str] = None
    priority: str = "medium"
    status: str = "todo"
    deadline: str = "2025-09-15"
    effort: int = 16
    estimatedDays: int = 3
    dependencies: List[str] = []
    requiredSkills: List[str] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigneeId: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[str] = None
    effort: Optional[int] = None


class TaskAssignRequest(BaseModel):
    employeeId: str


class TaskOut(BaseModel):
    id: str
    title: str
    description: str
    projectId: str
    assigneeId: Optional[str] = None
    priority: str
    status: str
    deadline: str
    effort: int
    estimatedDays: int
    dependencies: List[str] = []
    blockedBy: List[str] = []
    riskLevel: str = "none"
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True
