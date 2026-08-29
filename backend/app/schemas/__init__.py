"""CrewSense AI — Schemas Package."""

from app.schemas.common import ApiResponse, ErrorDetail
from app.schemas.auth import LoginRequest, RegisterRequest, UserOut, TokenResponse
from app.schemas.employee import EmployeeOut, EmployeeSkillOut, EmployeeCreate, EmployeeUpdate
from app.schemas.skill import SkillOut, SkillMatrixEntryOut, SkillGapOut, SkillGapSolutionOut
from app.schemas.project import ProjectOut, ProjectCreate, ProjectUpdate, ProjectHealthOut
from app.schemas.task import TaskOut, TaskCreate, TaskUpdate, TaskAssignRequest
from app.schemas.dependency import DependencyOut, CriticalPathOut, BottleneckOut
from app.schemas.risk import RiskOut
from app.schemas.recommendation import RecommendationOut, RecommendationActionResponse
from app.schemas.simulation import SimulationOut, SimulationRequest, SimulationResponseOut
from app.schemas.agent import (
    AgentChatRequest,
    AgentChatResponseOut,
    AgentInsightOut,
    AgentMessageOut,
    BuildTeamResponseOut,
    TeamRecommendationOut,
    TeamHealthOut,
)
from app.schemas.dashboard import DashboardKPIsOut, ActivityOut, NotificationOut

__all__ = [
    "ApiResponse",
    "ErrorDetail",
    "LoginRequest",
    "RegisterRequest",
    "UserOut",
    "TokenResponse",
    "EmployeeOut",
    "EmployeeSkillOut",
    "EmployeeCreate",
    "EmployeeUpdate",
    "SkillOut",
    "SkillMatrixEntryOut",
    "SkillGapOut",
    "SkillGapSolutionOut",
    "ProjectOut",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectHealthOut",
    "TaskOut",
    "TaskCreate",
    "TaskUpdate",
    "TaskAssignRequest",
    "DependencyOut",
    "CriticalPathOut",
    "BottleneckOut",
    "RiskOut",
    "RecommendationOut",
    "RecommendationActionResponse",
    "SimulationOut",
    "SimulationRequest",
    "SimulationResponseOut",
    "AgentChatRequest",
    "AgentChatResponseOut",
    "AgentInsightOut",
    "AgentMessageOut",
    "BuildTeamResponseOut",
    "TeamRecommendationOut",
    "TeamHealthOut",
    "DashboardKPIsOut",
    "ActivityOut",
    "NotificationOut",
]
