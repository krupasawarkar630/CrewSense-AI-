"""CrewSense AI — Agent & Team Builder Schemas."""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.skill import SkillGapOut


class AgentInsightOut(BaseModel):
    id: str
    severity: str  # critical / warning / info / success
    title: str
    description: str
    category: str  # workload / deadline / dependency / skill / capacity
    relatedEntityId: Optional[str] = None
    relatedEntityType: Optional[str] = None  # employee / project / task
    actionLabel: Optional[str] = None
    actionRoute: Optional[str] = None
    timestamp: str


class AnalysisStepOut(BaseModel):
    label: str
    status: str  # pending / in_progress / completed


class AgentMessageOut(BaseModel):
    id: str
    role: str  # agent / user
    content: str
    timestamp: str
    insights: Optional[List[AgentInsightOut]] = None
    isAnalyzing: Optional[bool] = None
    analysisSteps: Optional[List[AnalysisStepOut]] = None


class AgentChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class AgentChatResponseOut(BaseModel):
    message: AgentMessageOut
    updatedInsights: Optional[List[AgentInsightOut]] = None


class TeamRecommendationOut(BaseModel):
    employeeId: str
    role: str
    skillMatch: int
    currentWorkload: int
    projectedWorkload: int
    availability: str
    dependencyConflicts: int
    recommendationScore: int
    reasons: List[str] = []


class TeamHealthOut(BaseModel):
    skillCoverage: int
    capacityBalance: int
    deadlineConfidence: str
    aiConfidence: int


class BuildTeamResponseOut(BaseModel):
    recommendations: List[TeamRecommendationOut] = []
    teamHealth: TeamHealthOut
    skillGaps: List[SkillGapOut] = []
