"""CrewSense AI — Dependency Intelligence Engine."""

from __future__ import annotations

from typing import Any, Dict, List, Set
from app.models.task import Task, TaskDependency


def map_project_dependencies(
    tasks: List[Task],
    dependencies: List[TaskDependency],
) -> Dict[str, Any]:
    """
    Build directed adjacency graph of tasks and detect blocked tasks.
    """
    task_map = {t.id: t for t in tasks}
    adjacency: Dict[str, List[str]] = {t.id: [] for t in tasks}
    reverse_adjacency: Dict[str, List[str]] = {t.id: [] for t in tasks}

    for dep in dependencies:
        if dep.source_task_id in adjacency and dep.target_task_id in adjacency:
            # target depends on source
            adjacency[dep.source_task_id].append(dep.target_task_id)
            reverse_adjacency[dep.target_task_id].append(dep.source_task_id)

    # Detect which tasks are currently blocked
    blocked_task_ids: Set[str] = set()
    for task_id, prerequisites in reverse_adjacency.items():
        for pre_id in prerequisites:
            pre_task = task_map.get(pre_id)
            if pre_task and pre_task.status != "done":
                blocked_task_ids.add(task_id)
                break

    return {
        "adjacency": adjacency,
        "reverse_adjacency": reverse_adjacency,
        "blocked_task_ids": list(blocked_task_ids),
        "total_dependencies": len(dependencies),
    }
