"""CrewSense AI — Recommendation Schemas."""

from __future__ import annotations

from typing import Dict, Optional
from pydantic import BaseModel


class ExpectedImpactOut(BaseModel):
    workloadChange: Optional[int] = None
    riskReduction: Optional[int] = None
    delayReduction: Optional[int] = None
    capacityImprovement: Optional[int] = None


class RecommendationOut(BaseModel):
    id: str
    type: str  # reassign_task / add_resource / rebalance / skill_gap / dependency_resolution
    title: str
    description: str
    reason: str
    affectedEmployeeId: Optional[str] = None
    affectedTaskId: Optional[str] = None
    affectedProjectId: Optional[str] = None
    fromEmployeeId: Optional[str] = None
    toEmployeeId: Optional[str] = None
    expectedImpact: ExpectedImpactOut = ExpectedImpactOut()
    confidence: int = 90
    status: str = "pending"  # pending / approved / rejected / simulated
    createdAt: str

    class Config:
        from_attributes = True


class RecommendationActionResponse(BaseModel):
    recommendation: RecommendationOut
    appliedChanges: list = []
    message: str
