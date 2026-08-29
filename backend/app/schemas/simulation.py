"""CrewSense AI — Simulation Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel


class SimulationChangeOut(BaseModel):
    type: str  # reassign / remove / add / deadline_change
    description: str
    employeeId: Optional[str] = None
    taskId: Optional[str] = None
    projectId: Optional[str] = None
    value: Optional[str] = None


class SimulationResultsOut(BaseModel):
    workloadBefore: int
    workloadAfter: int
    delayProbabilityBefore: int
    delayProbabilityAfter: int
    riskBefore: str
    riskAfter: str
    overloadedBefore: int
    overloadedAfter: int
    capacityBalanceBefore: int
    capacityBalanceAfter: int
    confidence: int = 90
    recommended: bool = True


class SimulationOut(BaseModel):
    id: str
    name: str
    description: str
    scenario: str
    changes: List[SimulationChangeOut] = []
    results: SimulationResultsOut
    createdAt: str

    class Config:
        from_attributes = True


class SimulationComparisonOut(BaseModel):
    current: SimulationResultsOut
    proposed: SimulationResultsOut


class SimulationResponseOut(BaseModel):
    simulation: SimulationOut
    comparison: SimulationComparisonOut
    agentRecommendation: str


class SimulationRequest(BaseModel):
    scenario: str
