"""CrewSense AI — Dashboard Schemas."""

from __future__ import annotations

from typing import List
from pydantic import BaseModel


class DashboardKPIsOut(BaseModel):
    teamMembers: int
    activeProjects: int
    activeTasks: int
    availableCapacity: int
    overloaded: int
    atRiskProjects: int


class ActivityOut(BaseModel):
    id: str
    type: str  # agent_detection / approval / deadline_change / dependency_blocked / risk_update / task_reassignment
    title: str
    description: str
    timestamp: str
    relatedEntityId: str | None = None
    relatedEntityType: str | None = None

    class Config:
        from_attributes = True


class NotificationOut(BaseModel):
    id: str
    type: str
    title: str
    description: str
    severity: str
    read: bool
    actionRoute: str | None = None
    timestamp: str

    class Config:
        from_attributes = True
