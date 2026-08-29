"""CrewSense AI — Risk Engine Tests."""

import pytest
from app.models.project import Project
from app.models.task import Task
from app.models.employee import Employee
from app.intelligence.risk_engine import calculate_project_delivery_risk


def test_project_delivery_risk():
    proj = Project(
        id="p1",
        name="Phoenix",
        progress=50,
        deadline="2025-09-18",
        projected_completion="2025-09-21",
    )
    tasks = [
        Task(id="t1", title="Task 1", project_id="p1", status="blocked", effort=20),
        Task(id="t2", title="Task 2", project_id="p1", status="in_progress", effort=20),
    ]
    employees = [
        Employee(id="e1", name="Dev 1", role="Dev", department="Eng", email="d1@test.com", workload_status="overloaded"),
    ]

    risk = calculate_project_delivery_risk(
        project=proj,
        tasks=tasks,
        team_members=employees,
        blocked_task_count=1,
        critical_bottlenecks=1,
    )

    assert risk["delay_probability"] >= 50
    assert risk["risk_level"] in ("high", "critical")
    assert risk["health_score"] < 80
