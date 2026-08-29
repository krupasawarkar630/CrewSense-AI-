"""CrewSense AI — PostgreSQL to Neo4j Graph Synchronization."""

from __future__ import annotations

from typing import Optional
from app.db.neo4j import graph_client
from app.core.logging import get_logger

logger = get_logger("graph.sync")


async def sync_employee_node(emp_id: str, name: str, role: str, department: str, capacity: int = 100) -> None:
    """Sync Employee node into Neo4j."""
    cypher = """
    MERGE (e:Employee {id: $id})
    SET e.name = $name,
        e.role = $role,
        e.department = $department,
        e.capacity = $capacity
    """
    await graph_client.execute_write(cypher, {
        "id": emp_id,
        "name": name,
        "role": role,
        "department": department,
        "capacity": capacity,
    })


async def sync_skill_node(skill_id: str, name: str, category: str) -> None:
    """Sync Skill node into Neo4j."""
    cypher = """
    MERGE (s:Skill {id: $id})
    SET s.name = $name,
        s.category = $category
    """
    await graph_client.execute_write(cypher, {"id": skill_id, "name": name, "category": category})


async def sync_employee_skill(emp_id: str, skill_id: str, proficiency: str, years: int) -> None:
    """Create (Employee)-[:HAS_SKILL]->(Skill) relationship."""
    cypher = """
    MATCH (e:Employee {id: $emp_id})
    MATCH (s:Skill {id: $skill_id})
    MERGE (e)-[r:HAS_SKILL]->(s)
    SET r.proficiency = $proficiency,
        r.years_of_experience = $years
    """
    await graph_client.execute_write(cypher, {
        "emp_id": emp_id,
        "skill_id": skill_id,
        "proficiency": proficiency,
        "years": years,
    })


async def sync_project_node(project_id: str, name: str, priority: str, status: str) -> None:
    """Sync Project node into Neo4j."""
    cypher = """
    MERGE (p:Project {id: $id})
    SET p.name = $name,
        p.priority = $priority,
        p.status = $status
    """
    await graph_client.execute_write(cypher, {
        "id": project_id,
        "name": name,
        "priority": priority,
        "status": status,
    })


async def sync_task_node(task_id: str, title: str, status: str, priority: str, effort: int, deadline: str) -> None:
    """Sync Task node into Neo4j."""
    cypher = """
    MERGE (t:Task {id: $id})
    SET t.title = $title,
        t.status = $status,
        t.priority = $priority,
        t.effort = $effort,
        t.deadline = $deadline
    """
    await graph_client.execute_write(cypher, {
        "id": task_id,
        "title": title,
        "status": status,
        "priority": priority,
        "effort": effort,
        "deadline": deadline,
    })


async def sync_task_to_project(task_id: str, project_id: str) -> None:
    """Create (Task)-[:PART_OF]->(Project)."""
    cypher = """
    MATCH (t:Task {id: $task_id})
    MATCH (p:Project {id: $project_id})
    MERGE (t)-[:PART_OF]->(p)
    """
    await graph_client.execute_write(cypher, {"task_id": task_id, "project_id": project_id})


async def sync_task_assignment(task_id: str, emp_id: Optional[str]) -> None:
    """Create (Employee)-[:ASSIGNED_TO]->(Task) after clearing old assignment."""
    clear_cypher = """
    MATCH (:Employee)-[r:ASSIGNED_TO]->(t:Task {id: $task_id})
    DELETE r
    """
    await graph_client.execute_write(clear_cypher, {"task_id": task_id})

    if emp_id:
        assign_cypher = """
        MATCH (e:Employee {id: $emp_id})
        MATCH (t:Task {id: $task_id})
        MERGE (e)-[:ASSIGNED_TO]->(t)
        """
        await graph_client.execute_write(assign_cypher, {"emp_id": emp_id, "task_id": task_id})


async def sync_task_dependency(source_task_id: str, target_task_id: str, dep_type: str = "depends_on", is_critical: bool = False) -> None:
    """Create (TargetTask)-[:DEPENDS_ON]->(SourceTask)."""
    cypher = """
    MATCH (s:Task {id: $source_id})
    MATCH (t:Task {id: $target_id})
    MERGE (t)-[r:DEPENDS_ON]->(s)
    SET r.type = $dep_type,
        r.is_critical = $is_critical
    """
    await graph_client.execute_write(cypher, {
        "source_id": source_task_id,
        "target_id": target_task_id,
        "dep_type": dep_type,
        "is_critical": is_critical,
    })


async def sync_project_membership(project_id: str, emp_id: str) -> None:
    """Create (Employee)-[:WORKS_ON]->(Project)."""
    cypher = """
    MATCH (e:Employee {id: $emp_id})
    MATCH (p:Project {id: $project_id})
    MERGE (e)-[:WORKS_ON]->(p)
    """
    await graph_client.execute_write(cypher, {"emp_id": emp_id, "project_id": project_id})
