"""CrewSense AI — Dependency Graph & Critical Path Tests."""

import pytest
from app.models.task import Task, TaskDependency
from app.models.employee import Employee
from app.intelligence.critical_path_engine import calculate_critical_path
from app.intelligence.bottleneck_engine import detect_bottlenecks


def test_critical_path():
    tasks = [
        Task(id="t1", title="DB", project_id="p1", effort=10, status="done", deadline="2025-09-01"),
        Task(id="t2", title="API", project_id="p1", effort=20, status="in_progress", deadline="2025-09-05"),
        Task(id="t3", title="UI", project_id="p1", effort=15, status="blocked", deadline="2025-09-10"),
    ]
    deps = [
        TaskDependency(id="d1", source_task_id="t1", target_task_id="t2", type="blocks", is_critical=True),
        TaskDependency(id="d2", source_task_id="t2", target_task_id="t3", type="blocks", is_critical=True),
    ]

    cp = calculate_critical_path(
        project_id="p1",
        tasks=tasks,
        dependencies=deps,
    )

    assert cp["totalEffortHours"] == 45
    assert len(cp["criticalTasks"]) == 3
    assert cp["criticalTasks"][0]["taskId"] == "t1"
