"""CrewSense AI — Structured AI Output Schemas."""

from __future__ import annotations

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class AgentStructuredRecommendation(BaseModel):
    """Strict schema for AI agent recommendations per Section 12."""
    type: str = "task_reassignment"
    title: str
    from_employee: Optional[str] = None
    to_employee: Optional[str] = None
    reason: str
    expected_impact: Dict[str, int] = Field(default_factory=lambda: {
        "workload_before": 108,
        "workload_after": 84,
        "risk_before": 74,
        "risk_after": 31,
    })
    confidence: float = 0.92
    requires_approval: bool = True


class AgentResponsePayload(BaseModel):
    """Structured response returned by AI agent reasoning."""
    text_response: str
    insights: List[Dict[str, str]] = Field(default_factory=list)
    recommendations: List[AgentStructuredRecommendation] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)
