"""CrewSense AI — Risk Schemas."""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel


class RiskOut(BaseModel):
    id: str
    category: str  # workload / deadline / dependency / skill / capacity
    severity: str  # critical / high / medium / low / none
    title: str
    description: str
    affectedProjectId: Optional[str] = None
    affectedEmployeeId: Optional[str] = None
    affectedTaskId: Optional[str] = None
    probability: int
    impact: str
    detectedAt: str
    recommendation: Optional[str] = None

    class Config:
        from_attributes = True
