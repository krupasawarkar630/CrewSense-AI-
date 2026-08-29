"""CrewSense AI — Critical Path Intelligence Engine."""

from __future__ import annotations

from typing import Any, Dict, List, Set
from app.models.task import Task, TaskDependency
from app.models.employee import Employee


def calculate_critical_path(
    project_id: str,
    tasks: List[Task],
    dependencies: List[TaskDependency],
    employees: List[Employee] = None,
) -> Dict[str, Any]:
    """
    Compute project Critical Path DAG:
    - Longest path through the task dependency network
    - Total effort duration
    - Tasks on the critical path
    - Bottleneck assignee identification
    """
    emp_map = {e.id: e.name for e in (employees or [])}
    task_map = {t.id: t for t in tasks}

    # Filter dependencies within this project
    proj_task_ids = set(task_map.keys())
    proj_deps = [
        d for d in dependencies
        if d.source_task_id in proj_task_ids and d.target_task_id in proj_task_ids
    ]

    # Build adjacency
    adj: Dict[str, List[str]] = {t_id: [] for t_id in proj_task_ids}
    in_degree: Dict[str, int] = {t_id: 0 for t_id in proj_task_ids}

    for dep in proj_deps:
        adj[dep.source_task_id].append(dep.target_task_id)
        in_degree[dep.target_task_id] += 1

    # Topological sort & Longest path dynamic programming
    dist: Dict[str, int] = {t_id: task_map[t_id].effort for t_id in proj_task_ids}
    prev: Dict[str, str | None] = {t_id: None for t_id in proj_task_ids}

    queue = [t_id for t_id, deg in in_degree.items() if deg == 0]
    topo_order = []

    while queue:
        u = queue.pop(0)
        topo_order.append(u)
        for v in adj[u]:
            v_effort = task_map[v].effort
            if dist[u] + v_effort > dist[v]:
                dist[v] = dist[u] + v_effort
                prev[v] = u
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # Find task with maximum distance
    if not dist:
        return {
            "projectId": project_id,
            "criticalTasks": [],
            "totalEffortHours": 0,
            "expectedCompletionDays": 0,
            "projectedDelayDays": 0,
        }

    end_node = max(dist, key=dist.get)
    critical_chain = []
    curr: str | None = end_node
    while curr:
        critical_chain.append(curr)
        curr = prev[curr]
    critical_chain.reverse()

    critical_nodes = []
    assignee_efforts: Dict[str, int] = {}

    for t_id in critical_chain:
        t = task_map[t_id]
        assignee_name = emp_map.get(t.assignee_id or "", "Unassigned")
        if t.assignee_id:
            assignee_efforts[t.assignee_id] = assignee_efforts.get(t.assignee_id, 0) + t.effort

        critical_nodes.append({
            "taskId": t.id,
            "taskTitle": t.title,
            "assigneeId": t.assignee_id,
            "assigneeName": assignee_name,
            "effort": t.effort,
            "deadline": t.deadline,
            "status": t.status,
            "isBlocked": t.status == "blocked",
        })

    total_hours = dist[end_node]
    expected_days = max(1, int(round(total_hours / 8.0)))
    
    bottleneck_emp_id = max(assignee_efforts, key=assignee_efforts.get) if assignee_efforts else None

    return {
        "projectId": project_id,
        "criticalTasks": critical_nodes,
        "totalEffortHours": total_hours,
        "expectedCompletionDays": expected_days,
        "projectedDelayDays": 3 if any(n["isBlocked"] for n in critical_nodes) else 0,
        "bottleneckEmployeeId": bottleneck_emp_id,
        "bottleneckEmployeeName": emp_map.get(bottleneck_emp_id or "", None),
    }
