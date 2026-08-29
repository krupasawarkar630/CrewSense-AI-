"""CrewSense AI — Delivery Risk Calculation Engine."""

from __future__ import annotations

from typing import Any, Dict, List
from app.models.project import Project
from app.models.task import Task
from app.models.employee import Employee


def calculate_project_delivery_risk(
    project: Project,
    tasks: List[Task],
    team_members: List[Employee],
    blocked_task_count: int = 0,
    critical_bottlenecks: int = 0,
) -> Dict[str, Any]:
    """
    Calculate deterministic project delivery risk score:
    - Progress vs remaining effort
    - Blocked dependencies on critical path
    - Team workload and capacity overload
    - Delay probability percentage and risk classification
    """
    active_tasks = [t for t in tasks if t.status != "done"]
    total_tasks = len(tasks) or 1
    
    # 1. Progress completion factor
    progress_factor = max(0.0, 1.0 - (project.progress / 100.0))

    # 2. Dependency blockage factor
    blocked_factor = min(1.0, (blocked_task_count / max(1, len(active_tasks))) * 2.0)

    # 3. Workload stress factor across assigned team
    overloaded_count = sum(1 for m in team_members if getattr(m, "workload_status", "healthy") == "overloaded")
    overload_factor = min(1.0, overloaded_count / max(1, len(team_members)))

    # 4. Bottleneck factor
    bottleneck_factor = min(1.0, critical_bottlenecks * 0.3)

    # Composite Risk Score (0.0 to 1.0)
    risk_score = (
        (progress_factor * 0.25) +
        (blocked_factor * 0.35) +
        (overload_factor * 0.25) +
        (bottleneck_factor * 0.15)
    )

    delay_probability = int(round(min(98.0, risk_score * 100.0)))

    # Risk level classification
    if delay_probability >= 70:
        risk_level = "high" if delay_probability < 85 else "critical"
    elif delay_probability >= 40:
        risk_level = "medium"
    elif delay_probability >= 20:
        risk_level = "low"
    else:
        risk_level = "none"

    # Health score (inverse of risk)
    health_score = max(10, 100 - int(delay_probability * 0.8))

    # Risk factors summary
    top_factors = []
    if blocked_task_count > 0:
        top_factors.append(f"{blocked_task_count} tasks currently blocked by dependencies")
    if overloaded_count > 0:
        top_factors.append(f"{overloaded_count} key team members operating above 100% capacity")
    if critical_bottlenecks > 0:
        top_factors.append("API & core component bottlenecks on critical path")

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "health_score": health_score,
        "delay_probability": delay_probability,
        "projected_completion": project.projected_completion,
        "deadline": project.deadline,
        "top_risk_factors": top_factors,
    }
