"""CrewSense AI — Dynamic Capacity Engine."""

from __future__ import annotations

from typing import Dict, List
from app.models.employee import Employee
from app.models.task import Task


def calculate_employee_capacity(
    employee: Employee,
    active_tasks: List[Task],
    upcoming_tasks: List[Task] = None,
) -> Dict[str, int]:
    """
    Calculate dynamic capacity breakdown:
    - nominal_capacity: standard work week hours percentage (100%)
    - effective_capacity: remaining after meetings and approved leaves
    - available_capacity: unallocated capacity available for new work
    - projected_capacity: anticipated headroom considering upcoming deliverables
    """
    upcoming_tasks = upcoming_tasks or []

    # 1. Nominal capacity
    nominal = 100

    # 2. Leave deductions
    leave_deduction = 0
    if employee.leaves:
        leave_deduction = len(employee.leaves) * 15  # deduction percentage for active leave windows

    # 3. Meeting deductions
    meeting_hours = sum(m.hours_per_week for m in (employee.meetings or []))
    meeting_deduction = int((meeting_hours / 40.0) * 100) if meeting_hours > 0 else 10

    effective_capacity = max(10, nominal - leave_deduction - meeting_deduction)

    # 4. Currently committed task effort (assuming 40h per sprint)
    committed_effort_hours = sum(t.effort for t in active_tasks if t.status != "done")
    committed_pct = int((committed_effort_hours / 40.0) * 100)

    available_capacity = max(0, effective_capacity - committed_pct)

    # 5. Upcoming task projections
    upcoming_effort_hours = sum(t.effort for t in upcoming_tasks)
    upcoming_pct = int((upcoming_effort_hours / 40.0) * 100)

    projected_capacity = max(0, available_capacity - upcoming_pct)

    return {
        "nominal_capacity": nominal,
        "effective_capacity": effective_capacity,
        "available_capacity": available_capacity,
        "projected_capacity": projected_capacity,
    }
