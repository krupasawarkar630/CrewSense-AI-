"""CrewSense AI — Workload & Shadow Work Engine Tests."""

import pytest
from app.models.employee import Employee, Meeting
from app.models.task import Task
from app.intelligence.workload_engine import calculate_employee_workload
from app.intelligence.shadow_work_engine import calculate_shadow_workload


def test_workload_calculation():
    emp = Employee(
        id="emp-1",
        name="Test Dev",
        role="Senior Developer",
        department="Engineering",
        email="test@test.com",
        meetings=[Meeting(id="m1", employee_id="emp-1", title="Sync", hours_per_week=4.0)],
    )
    tasks = [
        Task(id="t1", title="Task 1", project_id="p1", assignee_id="emp-1", effort=20, status="in_progress", priority="critical"),
        Task(id="t2", title="Task 2", project_id="p1", assignee_id="emp-1", effort=16, status="in_progress", priority="high"),
    ]

    res = calculate_employee_workload(
        employee=emp,
        assigned_tasks=tasks,
        project_count=2,
    )

    assert res["visible_workload"] == 90  # 36h / 40h = 90%
    assert res["shadow_workload"] > 0
    assert res["effective_workload"] >= 90
    assert res["workload_status"] in ("high_load", "overloaded")
