"""CrewSense AI — Employee Service."""

from __future__ import annotations

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee, EmployeeSkill
from app.models.task import Task
from app.models.project import ProjectMember
from app.schemas.employee import EmployeeOut, EmployeeSkillOut, EmployeeCreate, EmployeeUpdate
from app.intelligence.workload_engine import calculate_employee_workload
from app.graph.sync import sync_employee_node, sync_employee_skill


class EmployeeService:
    @staticmethod
    async def get_all_employees(session: AsyncSession) -> List[EmployeeOut]:
        """Fetch all employees with dynamic workload and capacity metrics."""
        result = await session.execute(select(Employee))
        employees = list(result.scalars().all())

        task_res = await session.execute(select(Task))
        all_tasks = list(task_res.scalars().all())

        pm_res = await session.execute(select(ProjectMember))
        all_memberships = list(pm_res.scalars().all())

        output = []
        for emp in employees:
            emp_tasks = [t for t in all_tasks if t.assignee_id == emp.id]
            emp_projs = [pm.project_id for pm in all_memberships if pm.employee_id == emp.id]
            
            workload = calculate_employee_workload(
                employee=emp,
                assigned_tasks=emp_tasks,
                project_count=max(1, len(emp_projs)),
            )

            skills_out = [
                EmployeeSkillOut(
                    skill_id=es.skill_id,
                    proficiency=es.proficiency,
                    years_of_experience=es.years_of_experience,
                )
                for es in (emp.skills or [])
            ]

            output.append(EmployeeOut(
                id=emp.id,
                name=emp.name,
                avatar=emp.avatar,
                role=emp.role,
                department=emp.department,
                email=emp.email,
                skills=skills_out,
                currentProjects=emp_projs,
                visibleWorkload=workload["visible_workload"],
                shadowWorkload=workload["shadow_workload"],
                effectiveWorkload=workload["effective_workload"],
                projectedWorkload=workload["projected_workload"],
                capacity=emp.capacity,
                availability=workload["availability"],
                workloadStatus=workload["workload_status"],
                joinedDate=emp.joined_date,
            ))

        return output

    @staticmethod
    async def get_employee_by_id(session: AsyncSession, emp_id: str) -> Optional[EmployeeOut]:
        """Fetch single employee with deep capacity & workload breakdown."""
        emp = await session.get(Employee, emp_id)
        if not emp:
            return None

        task_res = await session.execute(select(Task).where(Task.assignee_id == emp_id))
        emp_tasks = list(task_res.scalars().all())

        pm_res = await session.execute(select(ProjectMember).where(ProjectMember.employee_id == emp_id))
        emp_projs = [pm.project_id for pm in pm_res.scalars().all()]

        workload = calculate_employee_workload(
            employee=emp,
            assigned_tasks=emp_tasks,
            project_count=max(1, len(emp_projs)),
        )

        skills_out = [
            EmployeeSkillOut(
                skill_id=es.skill_id,
                proficiency=es.proficiency,
                years_of_experience=es.years_of_experience,
            )
            for es in (emp.skills or [])
        ]

        return EmployeeOut(
            id=emp.id,
            name=emp.name,
            avatar=emp.avatar,
            role=emp.role,
            department=emp.department,
            email=emp.email,
            skills=skills_out,
            currentProjects=emp_projs,
            visibleWorkload=workload["visible_workload"],
            shadowWorkload=workload["shadow_workload"],
            effectiveWorkload=workload["effective_workload"],
            projectedWorkload=workload["projected_workload"],
            capacity=emp.capacity,
            availability=workload["availability"],
            workloadStatus=workload["workload_status"],
            joinedDate=emp.joined_date,
        )


employee_service = EmployeeService()
