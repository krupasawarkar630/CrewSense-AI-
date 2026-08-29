"""CrewSense AI — Workload Intelligence Engine."""

from __future__ import annotations

from typing import Dict, List
from app.models.employee import Employee
from app.models.task import Task
from app.intelligence.shadow_work_engine import calculate_shadow_workload


def calculate_employee_workload(
    employee: Employee,
    assigned_tasks: List[Task],
    project_count: int,
    blocked_task_count: int = 0,
) -> Dict[str, int | str]:
    """
    Calculate comprehensive workforce workload metrics:
    - visible_workload: directly assigned active tasks
    - shadow_workload: meetings, reviews, cross-project coordination, dependency sync
    - effective_workload: composite true workload load
    - projected_workload: next-cycle workload factoring upcoming deadlines
    - workload_status: 'healthy' | 'watch' | 'high_load' | 'overloaded'
    """
    # 1. Visible Workload: Task effort normalized to 40h sprint capacity
    active_tasks = [t for t in assigned_tasks if t.status != "done"]
    total_effort = sum(t.effort for t in active_tasks)
    visible_workload = int(round((total_effort / 40.0) * 100.0))

    # 2. Shadow Workload
    shadow_workload = calculate_shadow_workload(
        employee=employee,
        active_tasks=active_tasks,
        project_count=project_count,
        blocked_by_dependencies_count=blocked_task_count,
    )

    # 3. Pressure Adjustments (Deadlines & Critical tasks)
    critical_tasks = [t for t in active_tasks if t.priority == "critical"]
    deadline_pressure = len(critical_tasks) * 4

    effective_workload = visible_workload + shadow_workload + deadline_pressure

    # 4. Projected Workload: Factoring upcoming tasks due in the next 7 days
    high_urgency_tasks = [t for t in active_tasks if t.priority in ("critical", "high")]
    projected_surge = len(high_urgency_tasks) * 5
    projected_workload = effective_workload + projected_surge

    # 5. Workload Status Classification
    if effective_workload >= 100 or projected_workload >= 105:
        workload_status = "overloaded"
    elif effective_workload >= 85:
        workload_status = "high_load"
    elif effective_workload >= 70:
        workload_status = "watch"
    else:
        workload_status = "healthy"

    # Availability Classification
    if effective_workload >= 90:
        availability = "low"
    elif effective_workload >= 70:
        availability = "medium"
    else:
        availability = "high"

    return {
        "visible_workload": visible_workload,
        "shadow_workload": shadow_workload,
        "effective_workload": effective_workload,
        "projected_workload": projected_workload,
        "workload_status": workload_status,
        "availability": availability,
    }
