"""CrewSense AI — Task Service & Assignment."""

from __future__ import annotations

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskDependency
from app.schemas.task import TaskOut, TaskCreate, TaskUpdate
from app.graph.sync import sync_task_node, sync_task_assignment


class TaskService:
    @staticmethod
    async def get_all_tasks(
        session: AsyncSession,
        project_id: Optional[str] = None,
        assignee_id: Optional[str] = None,
    ) -> List[TaskOut]:
        """Retrieve tasks with filtering and dependencies."""
        stmt = select(Task)
        if project_id:
            stmt = stmt.where(Task.project_id == project_id)
        if assignee_id:
            stmt = stmt.where(Task.assignee_id == assignee_id)

        result = await session.execute(stmt)
        tasks = list(result.scalars().all())

        dep_res = await session.execute(select(TaskDependency))
        all_deps = list(dep_res.scalars().all())

        output = []
        for t in tasks:
            # upstream dependencies: tasks this task depends on
            dependencies = [d.target_task_id for d in all_deps if d.source_task_id == t.id]
            # blocked by: upstream tasks that are not done
            blocked_by = [
                d.target_task_id for d in all_deps
                if d.source_task_id == t.id and d.status == "blocked"
            ]

            output.append(TaskOut(
                id=t.id,
                title=t.title,
                description=t.description or "",
                projectId=t.project_id,
                assigneeId=t.assignee_id,
                priority=t.priority,
                status=t.status,
                deadline=t.deadline,
                effort=t.effort,
                estimatedDays=t.estimated_days,
                dependencies=dependencies,
                blockedBy=blocked_by,
                riskLevel=t.risk_level,
                createdAt=t.created_at.isoformat(),
                updatedAt=t.updated_at.isoformat(),
            ))

        return output

    @staticmethod
    async def assign_task(
        session: AsyncSession,
        task_id: str,
        employee_id: str,
    ) -> Optional[TaskOut]:
        """Assign/reassign a task to an employee and sync to Neo4j."""
        task = await session.get(Task, task_id)
        if not task:
            return None

        task.assignee_id = employee_id
        if task.status == "todo":
            task.status = "in_progress"

        await session.commit()
        await session.refresh(task)

        # Sync to Neo4j
        await sync_task_assignment(task.id, employee_id)

        return TaskOut(
            id=task.id,
            title=task.title,
            description=task.description or "",
            projectId=task.project_id,
            assigneeId=task.assignee_id,
            priority=task.priority,
            status=task.status,
            deadline=task.deadline,
            effort=task.effort,
            estimatedDays=task.estimated_days,
            dependencies=[],
            blockedBy=[],
            riskLevel=task.risk_level,
            createdAt=task.created_at.isoformat(),
            updatedAt=task.updated_at.isoformat(),
        )


task_service = TaskService()
