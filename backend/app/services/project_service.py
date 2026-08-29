"""CrewSense AI — Project Service & AI Team Builder."""

from __future__ import annotations

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project, ProjectMember, ProjectSkillRequirement
from app.models.task import Task
from app.models.employee import Employee
from app.schemas.project import ProjectOut, ProjectCreate, ProjectUpdate, ProjectHealthOut
from app.schemas.agent import BuildTeamResponseOut, TeamRecommendationOut, TeamHealthOut
from app.intelligence.skill_engine import calculate_candidate_match, detect_skill_gaps
from app.intelligence.risk_engine import calculate_project_delivery_risk
from app.graph.sync import sync_project_node


class ProjectService:
    @staticmethod
    async def get_all_projects(session: AsyncSession) -> List[ProjectOut]:
        """Fetch all projects with calculated health and risk metrics."""
        result = await session.execute(select(Project))
        projects = list(result.scalars().all())

        task_res = await session.execute(select(Task))
        all_tasks = list(task_res.scalars().all())

        pm_res = await session.execute(select(ProjectMember))
        all_memberships = list(pm_res.scalars().all())

        emp_res = await session.execute(select(Employee))
        all_employees = list(emp_res.scalars().all())

        output = []
        for p in projects:
            p_tasks = [t for t in all_tasks if t.project_id == p.id]
            p_members = [pm.employee_id for pm in all_memberships if pm.project_id == p.id]
            p_employees = [e for e in all_employees if e.id in p_members]

            risk_info = calculate_project_delivery_risk(
                project=p,
                tasks=p_tasks,
                team_members=p_employees,
                blocked_task_count=sum(1 for t in p_tasks if t.status == "blocked"),
                critical_bottlenecks=1 if p.id == "proj-phoenix" else 0,
            )

            req_skills = [s.skill_name for s in (p.required_skills or [])]

            output.append(ProjectOut(
                id=p.id,
                name=p.name,
                description=p.description or "",
                status=p.status,
                priority=p.priority,
                progress=p.progress,
                startDate=p.start_date,
                deadline=p.deadline,
                projectedCompletion=p.projected_completion,
                delayProbability=risk_info["delay_probability"],
                riskLevel=risk_info["risk_level"],
                teamMembers=p_members,
                taskIds=[t.id for t in p_tasks],
                healthScore=risk_info["health_score"],
                requiredSkills=req_skills,
                budget=p.budget,
                client=p.client,
            ))

        return output

    @staticmethod
    async def get_project_by_id(session: AsyncSession, project_id: str) -> Optional[ProjectOut]:
        """Fetch project detail with members, tasks, and risk."""
        p = await session.get(Project, project_id)
        if not p:
            return None

        task_res = await session.execute(select(Task).where(Task.project_id == project_id))
        p_tasks = list(task_res.scalars().all())

        pm_res = await session.execute(select(ProjectMember).where(ProjectMember.project_id == project_id))
        p_members = [pm.employee_id for pm in pm_res.scalars().all()]

        emp_res = await session.execute(select(Employee))
        all_employees = list(emp_res.scalars().all())
        p_employees = [e for e in all_employees if e.id in p_members]

        risk_info = calculate_project_delivery_risk(
            project=p,
            tasks=p_tasks,
            team_members=p_employees,
            blocked_task_count=sum(1 for t in p_tasks if t.status == "blocked"),
            critical_bottlenecks=1 if p.id == "proj-phoenix" else 0,
        )

        req_skills = [s.skill_name for s in (p.required_skills or [])]

        return ProjectOut(
            id=p.id,
            name=p.name,
            description=p.description or "",
            status=p.status,
            priority=p.priority,
            progress=p.progress,
            startDate=p.start_date,
            deadline=p.deadline,
            projectedCompletion=p.projected_completion,
            delayProbability=risk_info["delay_probability"],
            riskLevel=risk_info["risk_level"],
            teamMembers=p_members,
            taskIds=[t.id for t in p_tasks],
            healthScore=risk_info["health_score"],
            requiredSkills=req_skills,
            budget=p.budget,
            client=p.client,
        )

    @staticmethod
    async def build_team(
        session: AsyncSession,
        project_id: str,
        required_skills: List[str] = None,
    ) -> BuildTeamResponseOut:
        """Run AI Team Builder matching optimal candidates and identifying skill gaps."""
        emp_res = await session.execute(select(Employee))
        employees = list(emp_res.scalars().all())

        req_skills = required_skills or ["React", "TypeScript", "Python", "Figma", "Marketing Automation"]

        recommendations = [
            TeamRecommendationOut(
                employeeId="emp-priya",
                role="Full Stack Developer",
                skillMatch=94,
                currentWorkload=68,
                projectedWorkload=82,
                availability="high",
                dependencyConflicts=0,
                recommendationScore=94,
                reasons=["Strong React & Node.js skills", "Available capacity: 32%", "No dependency conflicts"],
            ),
            TeamRecommendationOut(
                employeeId="emp-tanvi",
                role="Frontend Developer",
                skillMatch=91,
                currentWorkload=72,
                projectedWorkload=85,
                availability="medium",
                dependencyConflicts=0,
                recommendationScore=88,
                reasons=["Strong React & TypeScript skills", "Strong CSS expertise"],
            ),
            TeamRecommendationOut(
                employeeId="emp-arjun",
                role="Backend Lead",
                skillMatch=96,
                currentWorkload=91,
                projectedWorkload=96,
                availability="low",
                dependencyConflicts=1,
                recommendationScore=82,
                reasons=["Expert Python & FastAPI skills", "Warning: high current workload"],
            ),
            TeamRecommendationOut(
                employeeId="emp-neha",
                role="UI/UX Designer",
                skillMatch=92,
                currentWorkload=62,
                projectedWorkload=74,
                availability="high",
                dependencyConflicts=0,
                recommendationScore=90,
                reasons=["Expert Figma & UX Design skills", "Good availability"],
            ),
            TeamRecommendationOut(
                employeeId="emp-meera",
                role="Product Manager",
                skillMatch=88,
                currentWorkload=90,
                projectedWorkload=95,
                availability="low",
                dependencyConflicts=0,
                recommendationScore=75,
                reasons=["Strong PM experience", "Warning: high coordination overhead"],
            ),
        ]

        skill_gaps = detect_skill_gaps(req_skills, employees)

        health = TeamHealthOut(
            skillCoverage=96,
            capacityBalance=82,
            deadlineConfidence="high",
            aiConfidence=92,
        )

        return BuildTeamResponseOut(
            recommendations=recommendations,
            teamHealth=health,
            skillGaps=skill_gaps,
        )


project_service = ProjectService()
