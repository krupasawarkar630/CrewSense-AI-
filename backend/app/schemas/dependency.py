"""CrewSense AI — Dependency Schemas."""

from __future__ import annotations

from typing import List
from pydantic import BaseModel


class DependencyOut(BaseModel):
    id: str
    sourceTaskId: str
    targetTaskId: str
    type: str  # blocks / depends_on / related
    isCritical: bool = False
    status: str = "active"  # resolved / active / blocked
    impact: str = ""

    class Config:
        from_attributes = True


class CriticalPathNode(BaseModel):
    taskId: str
    taskTitle: str
    assigneeId: str | None = None
    assigneeName: str = ""
    effort: int
    deadline: str
    status: str
    isBlocked: bool = False


class CriticalPathOut(BaseModel):
    projectId: str
    criticalTasks: List[CriticalPathNode] = []
    totalEffortHours: int = 0
    expectedCompletionDays: int = 0
    projectedDelayDays: int = 0
    bottleneckEmployeeId: str | None = None
    bottleneckEmployeeName: str | None = None


class BottleneckOut(BaseModel):
    employeeId: str
    employeeName: str
    role: str
    blockingTaskCount: int
    downstreamDependentTasks: int
    downstreamProjectCount: int
    delayImpactDays: int
    riskSeverity: str
    recommendedAction: str
