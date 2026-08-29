"""CrewSense AI — Bottleneck Detection Engine."""

from __future__ import annotations

from typing import Any, Dict, List, Set
from app.models.employee import Employee
from app.models.task import Task, TaskDependency


def find_downstream_reach(source_id: str, adjacency: Dict[str, List[str]]) -> Set[str]:
    """Find all reachable downstream tasks via BFS traversal."""
    visited = set()
    queue = [source_id]
    while queue:
        curr = queue.pop(0)
        for nxt in adjacency.get(curr, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return visited


def detect_bottlenecks(
    employees: List[Employee],
    tasks: List[Task],
    dependencies: List[TaskDependency],
) -> List[Dict[str, Any]]:
    """
    Identify bottleneck employees whose incomplete tasks block downstream workflows.
    """
    emp_map = {e.id: e for e in employees}
    task_map = {t.id: t for t in tasks}

    # Build adjacency
    adjacency: Dict[str, List[str]] = {t.id: [] for t in tasks}
    for dep in dependencies:
        if dep.source_task_id in adjacency:
            adjacency[dep.source_task_id].append(dep.target_task_id)

    bottlenecks = []
    # Calculate downstream impact per employee
    emp_tasks: Dict[str, List[Task]] = {}
    for t in tasks:
        if t.assignee_id and t.status != "done":
            emp_tasks.setdefault(t.assignee_id, []).append(t)

    for emp_id, e_tasks in emp_tasks.items():
        emp = emp_map.get(emp_id)
        if not emp:
            continue

        all_downstream_task_ids: Set[str] = set()
        for t in e_tasks:
            reach = find_downstream_reach(t.id, adjacency)
            all_downstream_task_ids.update(reach)

        if len(all_downstream_task_ids) >= 2:
            delay_impact_days = len(all_downstream_task_ids) * 1.5
            severity = "critical" if len(all_downstream_task_ids) >= 4 else "high" if len(all_downstream_task_ids) >= 3 else "medium"

            bottlenecks.append({
                "employeeId": emp.id,
                "employeeName": emp.name,
                "role": emp.role,
                "blockingTaskCount": len(e_tasks),
                "downstreamDependentTasks": len(all_downstream_task_ids),
                "downstreamProjectCount": 1,
                "delayImpactDays": int(round(delay_impact_days)),
                "riskSeverity": severity,
                "recommendedAction": f"Add secondary developer or reassign downstream tasks to unblock {len(all_downstream_task_ids)} tasks",
            })

    bottlenecks.sort(key=lambda b: b["downstreamDependentTasks"], reverse=True)
    return bottlenecks
