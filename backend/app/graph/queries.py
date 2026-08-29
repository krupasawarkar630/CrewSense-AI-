"""CrewSense AI — Neo4j Cypher Graph Intelligence Queries."""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from app.db.neo4j import graph_client
from app.core.logging import get_logger

logger = get_logger("graph.queries")


async def get_downstream_tasks(task_id: str) -> List[Dict[str, Any]]:
    """Find all tasks that transitively depend on the given task."""
    cypher = """
    MATCH (s:Task {id: $task_id})<-[:DEPENDS_ON*1..6]-(downstream:Task)
    OPTIONAL MATCH (downstream)<-[:ASSIGNED_TO]-(e:Employee)
    OPTIONAL MATCH (downstream)-[:PART_OF]->(p:Project)
    RETURN DISTINCT downstream.id AS task_id,
           downstream.title AS title,
           downstream.status AS status,
           downstream.priority AS priority,
           downstream.effort AS effort,
           downstream.deadline AS deadline,
           e.id AS assignee_id,
           e.name AS assignee_name,
           p.id AS project_id,
           p.name AS project_name
    """
    return await graph_client.query(cypher, {"task_id": task_id})


async def get_project_bottlenecks(project_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Identify bottleneck employees who have tasks with multiple downstream dependents."""
    if project_id:
        cypher = """
        MATCH (t:Task)-[:PART_OF]->(p:Project {id: $project_id})
        MATCH (e:Employee)-[:ASSIGNED_TO]->(t)
        MATCH (t)<-[:DEPENDS_ON*1..5]-(downstream:Task)
        RETURN e.id AS employee_id,
               e.name AS employee_name,
               e.role AS role,
               count(DISTINCT t) AS blocking_tasks,
               count(DISTINCT downstream) AS downstream_dependent_tasks
        ORDER BY downstream_dependent_tasks DESC
        """
        return await graph_client.query(cypher, {"project_id": project_id})
    else:
        cypher = """
        MATCH (e:Employee)-[:ASSIGNED_TO]->(t:Task)
        MATCH (t)<-[:DEPENDS_ON*1..5]-(downstream:Task)
        RETURN e.id AS employee_id,
               e.name AS employee_name,
               e.role AS role,
               count(DISTINCT t) AS blocking_tasks,
               count(DISTINCT downstream) AS downstream_dependent_tasks
        ORDER BY downstream_dependent_tasks DESC
        """
        return await graph_client.query(cypher)


async def get_project_critical_path_edges(project_id: str) -> List[Dict[str, Any]]:
    """Retrieve all dependency edges within a project."""
    cypher = """
    MATCH (target:Task)-[:PART_OF]->(p:Project {id: $project_id})
    MATCH (source:Task)-[:PART_OF]->(p)
    MATCH (target)-[r:DEPENDS_ON]->(source)
    RETURN source.id AS source_id,
           source.title AS source_title,
           source.status AS source_status,
           source.effort AS source_effort,
           target.id AS target_id,
           target.title AS target_title,
           target.status AS target_status,
           target.effort AS target_effort,
           r.is_critical AS is_critical
    """
    return await graph_client.query(cypher, {"project_id": project_id})
