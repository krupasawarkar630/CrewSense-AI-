"""CrewSense AI — Shadow Work Engine (Invisible Workload Calculation)."""

from __future__ import annotations

from typing import List
from app.models.employee import Employee, Meeting
from app.models.task import Task


def calculate_shadow_workload(
    employee: Employee,
    active_tasks: List[Task],
    project_count: int,
    blocked_by_dependencies_count: int = 0,
) -> int:
    """
    Calculate invisible shadow work percentage:
    - Meeting overhead
    - Coordination across multiple projects
    - Waiting / dependency synchronization
    - Context switching penalty
    """
    # 1. Meeting overhead (Nominal base 40h week)
    meeting_hours = sum(m.hours_per_week for m in (employee.meetings or []))
    if not meeting_hours and employee.meetings is not None and len(employee.meetings) == 0:
        # Fallback default baseline meetings based on role
        if "lead" in employee.role.lower() or "manager" in employee.role.lower():
            meeting_hours = 12.0
        elif "senior" in employee.role.lower():
            meeting_hours = 7.0
        else:
            meeting_hours = 4.0

    meeting_load_pct = (meeting_hours / 40.0) * 100.0

    # 2. Cross-project coordination overhead (3% per additional project beyond 1)
    coordination_pct = max(0, project_count - 1) * 3.5

    # 3. Context switching penalty for managing multiple tasks simultaneously
    active_task_count = len(active_tasks)
    context_switch_pct = max(0, active_task_count - 2) * 1.5

    # 4. Dependency waiting & sync friction
    dependency_waiting_pct = blocked_by_dependencies_count * 2.0

    total_shadow = meeting_load_pct + coordination_pct + context_switch_pct + dependency_waiting_pct
    return int(round(min(total_shadow, 45.0)))
