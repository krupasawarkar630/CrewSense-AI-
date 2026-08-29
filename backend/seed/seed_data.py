"""CrewSense AI — Complete Realistic Database & Graph Seed Script."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from sqlalchemy import select
from app.db.postgres import engine, async_session_factory, Base
from app.db.neo4j import graph_client
from app.core.security import hash_password
from app.models import (
    User,
    Skill,
    Employee,
    EmployeeSkill,
    Meeting,
    Leave,
    Project,
    ProjectMember,
    ProjectSkillRequirement,
    Task,
    TaskDependency,
    TaskSkillRequirement,
    Recommendation,
    Risk,
    Notification,
    Activity,
)
from app.graph.sync import (
    sync_employee_node,
    sync_skill_node,
    sync_employee_skill,
    sync_project_node,
    sync_task_node,
    sync_task_to_project,
    sync_task_assignment,
    sync_task_dependency,
    sync_project_membership,
)


SKILLS_DATA = [
    {"id": "sk-react", "name": "React", "category": "Frontend", "demand": 4},
    {"id": "sk-nextjs", "name": "Next.js", "category": "Frontend", "demand": 3},
    {"id": "sk-typescript", "name": "TypeScript", "category": "Frontend", "demand": 5},
    {"id": "sk-css", "name": "Tailwind / CSS", "category": "Frontend", "demand": 3},
    {"id": "sk-vue", "name": "Vue.js", "category": "Frontend", "demand": 1},
    {"id": "sk-python", "name": "Python", "category": "Backend", "demand": 4},
    {"id": "sk-fastapi", "name": "FastAPI", "category": "Backend", "demand": 3},
    {"id": "sk-nodejs", "name": "Node.js", "category": "Backend", "demand": 3},
    {"id": "sk-postgres", "name": "PostgreSQL", "category": "Database", "demand": 4},
    {"id": "sk-redis", "name": "Redis", "category": "Database", "demand": 2},
    {"id": "sk-mongodb", "name": "MongoDB", "category": "Database", "demand": 1},
    {"id": "sk-neo4j", "name": "Neo4j", "category": "Database", "demand": 2},
    {"id": "sk-docker", "name": "Docker", "category": "DevOps", "demand": 3},
    {"id": "sk-k8s", "name": "Kubernetes", "category": "DevOps", "demand": 2},
    {"id": "sk-aws", "name": "AWS", "category": "Cloud", "demand": 3},
    {"id": "sk-figma", "name": "Figma", "category": "Design", "demand": 3},
    {"id": "sk-ux", "name": "UX Research", "category": "Design", "demand": 2},
    {"id": "sk-ui", "name": "UI Design", "category": "Design", "demand": 3},
    {"id": "sk-ml", "name": "Machine Learning", "category": "AI / ML", "demand": 2},
    {"id": "sk-pytorch", "name": "PyTorch", "category": "AI / ML", "demand": 1},
    {"id": "sk-marketing", "name": "Marketing Automation", "category": "Marketing", "demand": 2},
    {"id": "sk-analytics", "name": "Product Analytics", "category": "Analytics", "demand": 2},
    {"id": "sk-security", "name": "Cybersecurity", "category": "Security", "demand": 2},
    {"id": "sk-qa", "name": "QA Automation", "category": "QA", "demand": 3},
]


EMPLOYEES_DATA = [
    {
        "id": "emp-rahul",
        "name": "Rahul Sharma",
        "avatar": "RS",
        "role": "Senior Frontend Developer",
        "department": "Engineering",
        "email": "rahul@crewsense.ai",
        "capacity": 100,
        "availability": "low",
        "workload_status": "overloaded",
        "joined_date": "2023-03-15",
        "skills": [
            ("sk-react", "strong", 5),
            ("sk-nextjs", "strong", 3),
            ("sk-typescript", "strong", 4),
            ("sk-css", "moderate", 5),
            ("sk-nodejs", "moderate", 2),
        ],
        "projects": ["proj-phoenix", "proj-titan"],
        "meetings": [("Sprint Planning", 2.0), ("Phoenix Standup", 2.5), ("Titan Architecture Sync", 3.0)],
    },
    {
        "id": "emp-priya",
        "name": "Priya Patel",
        "avatar": "PP",
        "role": "Full Stack Developer",
        "department": "Engineering",
        "email": "priya@crewsense.ai",
        "capacity": 100,
        "availability": "high",
        "workload_status": "healthy",
        "joined_date": "2023-06-01",
        "skills": [
            ("sk-react", "strong", 4),
            ("sk-nodejs", "strong", 4),
            ("sk-typescript", "moderate", 3),
            ("sk-postgres", "strong", 3),
            ("sk-python", "moderate", 2),
        ],
        "projects": ["proj-phoenix"],
        "meetings": [("Sprint Planning", 2.0), ("Phoenix Standup", 1.5)],
    },
    {
        "id": "emp-arjun",
        "name": "Arjun Mehta",
        "avatar": "AM",
        "role": "Backend Lead",
        "department": "Engineering",
        "email": "arjun@crewsense.ai",
        "capacity": 100,
        "availability": "low",
        "workload_status": "high_load",
        "joined_date": "2022-11-01",
        "skills": [
            ("sk-python", "strong", 6),
            ("sk-fastapi", "strong", 3),
            ("sk-postgres", "strong", 5),
            ("sk-redis", "strong", 3),
            ("sk-docker", "moderate", 3),
            ("sk-aws", "moderate", 2),
        ],
        "projects": ["proj-phoenix", "proj-apollo"],
        "meetings": [("Tech Lead Sync", 3.0), ("Phoenix Standup", 2.0), ("Apollo Architecture", 2.5)],
    },
    {
        "id": "emp-neha",
        "name": "Neha Gupta",
        "avatar": "NG",
        "role": "UI/UX Designer",
        "department": "Design",
        "email": "neha@crewsense.ai",
        "capacity": 100,
        "availability": "high",
        "workload_status": "healthy",
        "joined_date": "2023-01-10",
        "skills": [
            ("sk-figma", "strong", 5),
            ("sk-ux", "strong", 5),
            ("sk-ui", "strong", 4),
            ("sk-css", "moderate", 2),
        ],
        "projects": ["proj-phoenix", "proj-mercury"],
        "meetings": [("Design Critique", 2.5), ("Sprint Planning", 2.0)],
    },
    {
        "id": "emp-anita",
        "name": "Anita Roy",
        "avatar": "AR",
        "role": "Backend Developer",
        "department": "Engineering",
        "email": "anita@crewsense.ai",
        "capacity": 100,
        "availability": "high",
        "workload_status": "healthy",
        "joined_date": "2023-08-15",
        "skills": [
            ("sk-python", "strong", 4),
            ("sk-fastapi", "strong", 3),
            ("sk-postgres", "moderate", 3),
            ("sk-docker", "moderate", 2),
        ],
        "projects": ["proj-mercury"],
        "meetings": [("Backend Sync", 1.5), ("Mercury Standup", 1.5)],
    },
    {
        "id": "emp-tanvi",
        "name": "Tanvi Reddy",
        "avatar": "TR",
        "role": "Frontend Developer",
        "department": "Engineering",
        "email": "tanvi@crewsense.ai",
        "capacity": 100,
        "availability": "medium",
        "workload_status": "watch",
        "joined_date": "2023-09-01",
        "skills": [
            ("sk-react", "strong", 3),
            ("sk-typescript", "strong", 3),
            ("sk-css", "strong", 4),
            ("sk-nextjs", "moderate", 2),
        ],
        "projects": ["proj-phoenix"],
        "meetings": [("Frontend Sync", 1.5), ("Phoenix Standup", 2.0)],
    },
    {
        "id": "emp-suresh",
        "name": "Suresh Kumar",
        "avatar": "SK",
        "role": "Backend Developer",
        "department": "Engineering",
        "email": "suresh@crewsense.ai",
        "capacity": 100,
        "availability": "high",
        "workload_status": "healthy",
        "joined_date": "2024-01-15",
        "skills": [
            ("sk-python", "strong", 3),
            ("sk-fastapi", "moderate", 2),
            ("sk-postgres", "strong", 3),
            ("sk-redis", "moderate", 2),
        ],
        "projects": ["proj-apollo"],
        "meetings": [("Apollo Standup", 2.0)],
    },
    {
        "id": "emp-vikram",
        "name": "Vikram Singh",
        "avatar": "VS",
        "role": "DevOps Lead",
        "department": "Infrastructure",
        "email": "vikram@crewsense.ai",
        "capacity": 100,
        "availability": "medium",
        "workload_status": "watch",
        "joined_date": "2022-08-01",
        "skills": [
            ("sk-docker", "strong", 6),
            ("sk-k8s", "strong", 5),
            ("sk-aws", "strong", 5),
            ("sk-security", "strong", 4),
        ],
        "projects": ["proj-phoenix", "proj-titan", "proj-orion"],
        "meetings": [("Infra Sync", 3.0), ("Security Review", 2.0)],
    },
    {
        "id": "emp-meera",
        "name": "Meera Nair",
        "avatar": "MN",
        "role": "Product Manager",
        "department": "Product",
        "email": "meera@crewsense.ai",
        "capacity": 100,
        "availability": "low",
        "workload_status": "high_load",
        "joined_date": "2022-05-15",
        "skills": [
            ("sk-analytics", "strong", 5),
            ("sk-ux", "strong", 4),
        ],
        "projects": ["proj-phoenix", "proj-apollo", "proj-mercury"],
        "meetings": [("PM Standup", 5.0), ("Stakeholder Reviews", 6.0)],
    },
    {
        "id": "emp-ishita",
        "name": "Ishita Jain",
        "avatar": "IJ",
        "role": "Growth Marketer",
        "department": "Marketing",
        "email": "ishita@crewsense.ai",
        "capacity": 100,
        "availability": "high",
        "workload_status": "healthy",
        "joined_date": "2023-11-01",
        "skills": [
            ("sk-marketing", "moderate", 3),
            ("sk-analytics", "strong", 4),
        ],
        "projects": ["proj-apollo"],
        "meetings": [("Marketing Sync", 2.0)],
    },
    {
        "id": "emp-raj",
        "name": "Raj Malhotra",
        "avatar": "RM",
        "role": "Staff Engineer",
        "department": "Engineering",
        "email": "raj@crewsense.ai",
        "capacity": 100,
        "availability": "low",
        "workload_status": "overloaded",
        "joined_date": "2021-09-01",
        "skills": [
            ("sk-python", "strong", 8),
            ("sk-fastapi", "strong", 4),
            ("sk-postgres", "strong", 7),
            ("sk-k8s", "strong", 4),
            ("sk-ml", "moderate", 3),
        ],
        "projects": ["proj-phoenix", "proj-titan"],
        "meetings": [("Architecture Council", 4.0), ("Lead Sync", 3.0), ("Phoenix Sync", 2.0)],
    },
    {
        "id": "emp-kavita",
        "name": "Kavita Rao",
        "avatar": "KR",
        "role": "Scrum Master",
        "department": "Product",
        "email": "kavita@crewsense.ai",
        "capacity": 100,
        "availability": "low",
        "workload_status": "high_load",
        "joined_date": "2023-02-01",
        "skills": [
            ("sk-analytics", "strong", 4),
        ],
        "projects": ["proj-phoenix", "proj-titan", "proj-orion"],
        "meetings": [("Agile Ceremonies", 9.0), ("Scrum Lead Sync", 2.0)],
    },
]


PROJECTS_DATA = [
    {
        "id": "proj-phoenix",
        "name": "Project Phoenix",
        "description": "E-Commerce Checkout & Global Payment Gateway Revamp",
        "status": "at_risk",
        "priority": "critical",
        "progress": 68,
        "start_date": "2025-07-01",
        "deadline": "2025-09-18",
        "projected_completion": "2025-09-21",
        "delay_probability": 74,
        "risk_level": "high",
        "health_score": 42,
        "budget": 250000.0,
        "client": "Apex Retail Global",
        "members": ["emp-rahul", "emp-priya", "emp-arjun", "emp-tanvi", "emp-neha", "emp-vikram", "emp-meera", "emp-raj", "emp-kavita"],
        "required_skills": ["React", "FastAPI", "PostgreSQL", "Tailwind / CSS", "Docker"],
    },
    {
        "id": "proj-apollo",
        "name": "Project Apollo",
        "description": "AI-Powered Autonomous Campaign & Recommendation Engine",
        "status": "planning",
        "priority": "high",
        "progress": 25,
        "start_date": "2025-08-15",
        "deadline": "2025-10-30",
        "projected_completion": "2025-10-30",
        "delay_probability": 28,
        "risk_level": "medium",
        "health_score": 78,
        "budget": 180000.0,
        "client": "Starlight Digital",
        "members": ["emp-arjun", "emp-suresh", "emp-ishita", "emp-meera"],
        "required_skills": ["Python", "FastAPI", "Marketing Automation", "Product Analytics"],
    },
    {
        "id": "proj-titan",
        "name": "Project Titan",
        "description": "Enterprise Core Real-Time Data Pipeline & ML Ingestion",
        "status": "active",
        "priority": "high",
        "progress": 55,
        "start_date": "2025-06-01",
        "deadline": "2025-10-15",
        "projected_completion": "2025-10-18",
        "delay_probability": 42,
        "risk_level": "medium",
        "health_score": 71,
        "budget": 320000.0,
        "client": "Nexus Core Systems",
        "members": ["emp-rahul", "emp-raj", "emp-vikram", "emp-kavita"],
        "required_skills": ["Python", "Kubernetes", "Redis", "Machine Learning"],
    },
    {
        "id": "proj-mercury",
        "name": "Project Mercury",
        "description": "Mobile Experience Redesign & Multi-Platform PWA",
        "status": "active",
        "priority": "medium",
        "progress": 82,
        "start_date": "2025-05-15",
        "deadline": "2025-09-30",
        "projected_completion": "2025-09-28",
        "delay_probability": 15,
        "risk_level": "low",
        "health_score": 92,
        "budget": 120000.0,
        "client": "Orbit Commerce",
        "members": ["emp-neha", "emp-anita", "emp-meera"],
        "required_skills": ["Figma", "UI Design", "FastAPI", "React"],
    },
    {
        "id": "proj-orion",
        "name": "Project Orion",
        "description": "Cloud Security Hardening & Zero-Trust Architecture",
        "status": "active",
        "priority": "medium",
        "progress": 40,
        "start_date": "2025-07-15",
        "deadline": "2025-11-15",
        "projected_completion": "2025-11-15",
        "delay_probability": 30,
        "risk_level": "low",
        "health_score": 84,
        "budget": 150000.0,
        "client": "Internal SecOps",
        "members": ["emp-vikram", "emp-kavita"],
        "required_skills": ["Cybersecurity", "Docker", "AWS", "Kubernetes"],
    },
    {
        "id": "proj-nova",
        "name": "Project Nova",
        "description": "Next-Generation Customer Support Knowledge Assistant",
        "status": "completed",
        "priority": "low",
        "progress": 100,
        "start_date": "2025-03-01",
        "deadline": "2025-08-01",
        "projected_completion": "2025-07-28",
        "delay_probability": 0,
        "risk_level": "none",
        "health_score": 100,
        "budget": 95000.0,
        "client": "Global HelpDesk",
        "members": ["emp-priya", "emp-anita"],
        "required_skills": ["FastAPI", "React", "PostgreSQL"],
    },
]


TASKS_DATA = [
    # Phoenix Critical Path
    {"id": "task-ph-1", "title": "Database Schema & Partitioning", "project_id": "proj-phoenix", "assignee_id": "emp-arjun", "priority": "critical", "status": "done", "deadline": "2025-08-20", "effort": 24, "risk_level": "none"},
    {"id": "task-ph-2", "title": "Core Payment API Layer", "project_id": "proj-phoenix", "assignee_id": "emp-arjun", "priority": "critical", "status": "in_progress", "deadline": "2025-09-05", "effort": 36, "risk_level": "high"},
    {"id": "task-ph-3", "title": "Payment Gateway Integration", "project_id": "proj-phoenix", "assignee_id": "emp-rahul", "priority": "critical", "status": "blocked", "deadline": "2025-09-10", "effort": 32, "risk_level": "high"},
    {"id": "task-ph-4", "title": "Checkout UI Components", "project_id": "proj-phoenix", "assignee_id": "emp-tanvi", "priority": "high", "status": "blocked", "deadline": "2025-09-12", "effort": 28, "risk_level": "medium"},
    {"id": "task-ph-5", "title": "End-to-End QA Testing", "project_id": "proj-phoenix", "assignee_id": "emp-priya", "priority": "high", "status": "todo", "deadline": "2025-09-15", "effort": 20, "risk_level": "medium"},
    {"id": "task-ph-6", "title": "Production Deployment & Monitoring", "project_id": "proj-phoenix", "assignee_id": "emp-vikram", "priority": "critical", "status": "todo", "deadline": "2025-09-18", "effort": 16, "risk_level": "medium"},

    # Other Phoenix Tasks
    {"id": "task-ph-7", "title": "Product Catalog UI", "project_id": "proj-phoenix", "assignee_id": "emp-rahul", "priority": "medium", "status": "in_progress", "deadline": "2025-09-08", "effort": 24, "risk_level": "medium"},
    {"id": "task-ph-8", "title": "Design System Token Export", "project_id": "proj-phoenix", "assignee_id": "emp-neha", "priority": "medium", "status": "done", "deadline": "2025-08-25", "effort": 16, "risk_level": "none"},

    # Titan Tasks
    {"id": "task-ti-1", "title": "Titan API Gateway Layer", "project_id": "proj-titan", "assignee_id": "emp-raj", "priority": "high", "status": "in_progress", "deadline": "2025-09-25", "effort": 30, "risk_level": "high"},
    {"id": "task-ti-2", "title": "Stream Processor Cluster Setup", "project_id": "proj-titan", "assignee_id": "emp-vikram", "priority": "high", "status": "in_progress", "deadline": "2025-09-30", "effort": 24, "risk_level": "medium"},

    # Apollo Tasks
    {"id": "task-ap-1", "title": "Audience Segmentation Algorithm", "project_id": "proj-apollo", "assignee_id": "emp-arjun", "priority": "high", "status": "todo", "deadline": "2025-10-05", "effort": 32, "risk_level": "low"},
    {"id": "task-ap-2", "title": "Campaign Dispatch Service", "project_id": "proj-apollo", "assignee_id": "emp-suresh", "priority": "medium", "status": "todo", "deadline": "2025-10-12", "effort": 28, "risk_level": "low"},
]


DEPENDENCIES_DATA = [
    # Phoenix Critical Path
    {"id": "dep-1", "source": "task-ph-1", "target": "task-ph-2", "type": "blocks", "critical": True, "status": "resolved", "impact": "DB schema unblocks API layer"},
    {"id": "dep-2", "source": "task-ph-2", "target": "task-ph-3", "type": "blocks", "critical": True, "status": "blocked", "impact": "Payment gateway waiting for API"},
    {"id": "dep-3", "source": "task-ph-3", "target": "task-ph-4", "type": "blocks", "critical": True, "status": "blocked", "impact": "Checkout UI waiting on payment integration"},
    {"id": "dep-4", "source": "task-ph-4", "target": "task-ph-5", "type": "blocks", "critical": True, "status": "active", "impact": "QA requires Checkout UI"},
    {"id": "dep-5", "source": "task-ph-5", "target": "task-ph-6", "type": "blocks", "critical": True, "status": "active", "impact": "Release blocked until QA sign-off"},
]


RISKS_DATA = [
    {
        "id": "risk-1",
        "category": "workload",
        "severity": "critical",
        "title": "Rahul at 108% Projected Capacity",
        "description": "Rahul Sharma is projected to exceed capacity next week due to overlapping Phoenix and Titan tasks.",
        "affected_employee_id": "emp-rahul",
        "affected_project_id": "proj-phoenix",
        "probability": 92,
        "impact": "Delivery delays on Product Catalog UI and Titan dashboard",
        "recommendation": "Move Payment Integration to Priya",
    },
    {
        "id": "risk-2",
        "category": "deadline",
        "severity": "high",
        "title": "Phoenix 74% Delay Probability",
        "description": "Project Phoenix has a 74% probability of missing its September 18 deadline due to API bottleneck and cascading dependencies.",
        "affected_project_id": "proj-phoenix",
        "probability": 74,
        "impact": "3-day projected delay affecting client delivery",
        "recommendation": "Add API development support for Arjun",
    },
    {
        "id": "risk-3",
        "category": "dependency",
        "severity": "high",
        "title": "Arjun — Critical Bottleneck",
        "description": "4 downstream tasks depend on Arjun's API work. A 2-day delay on API will cascade to a 3-day project delay.",
        "affected_employee_id": "emp-arjun",
        "affected_project_id": "proj-phoenix",
        "affected_task_id": "task-ph-2",
        "probability": 68,
        "impact": "Payment, Checkout, QA, and Release all blocked",
        "recommendation": "Consider adding Anita as API support",
    },
    {
        "id": "risk-4",
        "category": "skill",
        "severity": "medium",
        "title": "Apollo Marketing Automation Skill Gap",
        "description": "Project Apollo requires Marketing Automation skills but no team member has strong proficiency.",
        "affected_project_id": "proj-apollo",
        "probability": 85,
        "impact": "Marketing automation integration may be delayed or low quality",
        "recommendation": "Assign to Ishita (partial match 71%) or add external resource",
    },
]


RECOMMENDATIONS_DATA = [
    {
        "id": "rec-1",
        "type": "reassign_task",
        "title": "Move Payment Integration to Priya",
        "description": "Reassign Payment Integration (Phoenix) from Rahul to Priya to reduce Rahul's overload.",
        "reason": "Rahul is projected at 108% capacity. Priya has 32% available capacity and strong backend skills.",
        "affected_employee_id": "emp-rahul",
        "affected_task_id": "task-ph-3",
        "affected_project_id": "proj-phoenix",
        "from_employee_id": "emp-rahul",
        "to_employee_id": "emp-priya",
        "expected_impact": {"workloadChange": -23, "riskReduction": 40, "delayReduction": 12, "capacityImprovement": 15},
        "confidence": 91,
        "status": "pending",
    },
    {
        "id": "rec-2",
        "type": "add_resource",
        "title": "Add API Development Support for Arjun",
        "description": "Assign Anita as secondary developer on Phoenix API to reduce bottleneck risk.",
        "reason": "4 tasks depend on Arjun's API work. Adding support will reduce critical path risk by 35%.",
        "affected_employee_id": "emp-arjun",
        "affected_task_id": "task-ph-2",
        "affected_project_id": "proj-phoenix",
        "to_employee_id": "emp-anita",
        "expected_impact": {"workloadChange": -15, "riskReduction": 35, "delayReduction": 18},
        "confidence": 87,
        "status": "pending",
    },
]


NOTIFICATIONS_DATA = [
    {
        "id": "notif-1",
        "type": "risk",
        "title": "Rahul Projected at 108% Capacity",
        "description": "Workload threshold exceeded for next sprint cycle.",
        "severity": "critical",
        "read": False,
        "action_route": "/manager/workload",
    },
    {
        "id": "notif-2",
        "type": "risk",
        "title": "Project Phoenix Delivery Risk (74%)",
        "description": "Critical path bottleneck detected on Payment API layer.",
        "severity": "warning",
        "read": False,
        "action_route": "/manager/projects/proj-phoenix",
    },
    {
        "id": "notif-3",
        "type": "recommendation",
        "title": "✦ New Rebalancing Plan Available",
        "description": "CrewSense recommends moving Payment Integration to Priya Patel.",
        "severity": "info",
        "read": False,
        "action_route": "/manager/recommendations",
    },
]


ACTIVITIES_DATA = [
    {
        "id": "act-1",
        "type": "agent_detection",
        "title": "Agent detected critical bottleneck on Arjun Mehta",
        "description": "4 downstream deliverables dependent on Core API task.",
    },
    {
        "id": "act-2",
        "type": "risk_update",
        "title": "Phoenix delay probability updated to 74%",
        "description": "Recalculated based on API bottleneck and dependency chain.",
    },
    {
        "id": "act-3",
        "type": "agent_detection",
        "title": "Agent flagged Rahul Sharma overload (108%)",
        "description": "Overlapping Phoenix and Titan deadlines detected.",
    },
]


from sqlalchemy import select, text

async def seed_all() -> None:
    """Seed PostgreSQL and Neo4j databases with interconnected workforce intelligence models."""
    print("[SEED] Initializing PostgreSQL database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[SEED] Tables verified in Neon!")

    async with async_session_factory() as session:
        print("[SEED] Seeding Skills...")
        for s in SKILLS_DATA:
            skill = Skill(id=s["id"], name=s["name"], category=s["category"], demand=s["demand"])
            session.add(skill)
            await sync_skill_node(s["id"], s["name"], s["category"])
        await session.commit()

        print("[SEED] Seeding Employees & Skills...")
        for e in EMPLOYEES_DATA:
            emp = Employee(
                id=e["id"],
                name=e["name"],
                avatar=e["avatar"],
                role=e["role"],
                department=e["department"],
                email=e["email"],
                capacity=e["capacity"],
                availability=e["availability"],
                workload_status=e["workload_status"],
                joined_date=e["joined_date"],
            )
            session.add(emp)
            await sync_employee_node(e["id"], e["name"], e["role"], e["department"], e["capacity"])

            for s_id, prof, years in e["skills"]:
                es = EmployeeSkill(employee_id=e["id"], skill_id=s_id, proficiency=prof, years_of_experience=years)
                session.add(es)
                await sync_employee_skill(e["id"], s_id, prof, years)

            for m_title, m_hours in e.get("meetings", []):
                meet = Meeting(
                    id=f"meet-{e['id']}-{abs(hash(m_title)) % 10000}",
                    employee_id=e["id"],
                    title=m_title,
                    hours_per_week=m_hours,
                )
                session.add(meet)
        await session.commit()

        print("[SEED] Seeding Users...")
        admin_user = User(
            id="user-alex",
            email="alex@crewsense.ai",
            name="Alex Morgan",
            hashed_password=hash_password("demo123"),
            role="manager",
        )
        emp_user = User(
            id="user-rahul",
            email="rahul@crewsense.ai",
            name="Rahul Sharma",
            hashed_password=hash_password("demo123"),
            role="employee",
            employee_id="emp-rahul",
        )
        session.add(admin_user)
        session.add(emp_user)
        await session.commit()

        print("[SEED] Seeding Projects & Memberships...")
        for p in PROJECTS_DATA:
            proj = Project(
                id=p["id"],
                name=p["name"],
                description=p["description"],
                status=p["status"],
                priority=p["priority"],
                progress=p["progress"],
                start_date=p["start_date"],
                deadline=p["deadline"],
                projected_completion=p["projected_completion"],
                delay_probability=p["delay_probability"],
                risk_level=p["risk_level"],
                health_score=p["health_score"],
                budget=p["budget"],
                client=p["client"],
            )
            session.add(proj)
            await sync_project_node(p["id"], p["name"], p["priority"], p["status"])

            for m_id in p["members"]:
                pm = ProjectMember(project_id=p["id"], employee_id=m_id)
                session.add(pm)
                await sync_project_membership(p["id"], m_id)

            for s_name in p["required_skills"]:
                psr = ProjectSkillRequirement(project_id=p["id"], skill_name=s_name)
                session.add(psr)
        await session.commit()

        print("[SEED] Seeding Tasks & Assignments...")
        for t in TASKS_DATA:
            task = Task(
                id=t["id"],
                title=t["title"],
                project_id=t["project_id"],
                assignee_id=t.get("assignee_id"),
                priority=t["priority"],
                status=t["status"],
                deadline=t["deadline"],
                effort=t["effort"],
                risk_level=t.get("risk_level", "none"),
            )
            session.add(task)
            await sync_task_node(t["id"], t["title"], t["status"], t["priority"], t["effort"], t["deadline"])
            await sync_task_to_project(t["id"], t["project_id"])
            if t.get("assignee_id"):
                await sync_task_assignment(t["id"], t["assignee_id"])
        await session.commit()

        print("[SEED] Seeding Dependencies...")
        for d in DEPENDENCIES_DATA:
            dep = TaskDependency(
                id=d["id"],
                source_task_id=d["source"],
                target_task_id=d["target"],
                type=d["type"],
                is_critical=d["critical"],
                status=d["status"],
                impact=d["impact"],
            )
            session.add(dep)
            await sync_task_dependency(d["source"], d["target"], d["type"], d["critical"])
        await session.commit()

        print("[SEED] Seeding Risks & Recommendations...")
        for r in RISKS_DATA:
            risk = Risk(
                id=r["id"],
                category=r["category"],
                severity=r["severity"],
                title=r["title"],
                description=r["description"],
                affected_project_id=r.get("affected_project_id"),
                affected_employee_id=r.get("affected_employee_id"),
                affected_task_id=r.get("affected_task_id"),
                probability=r["probability"],
                impact=r["impact"],
                recommendation=r.get("recommendation"),
            )
            session.add(risk)

        for rec in RECOMMENDATIONS_DATA:
            recommendation = Recommendation(
                id=rec["id"],
                type=rec["type"],
                title=rec["title"],
                description=rec["description"],
                reason=rec["reason"],
                affected_employee_id=rec.get("affected_employee_id"),
                affected_task_id=rec.get("affected_task_id"),
                affected_project_id=rec.get("affected_project_id"),
                from_employee_id=rec.get("from_employee_id"),
                to_employee_id=rec.get("to_employee_id"),
                expected_impact=rec["expected_impact"],
                confidence=rec["confidence"],
                status=rec["status"],
            )
            session.add(recommendation)
        await session.commit()

        print("[SEED] Seeding Notifications & Activities...")
        for n in NOTIFICATIONS_DATA:
            notif = Notification(
                id=n["id"],
                type=n["type"],
                title=n["title"],
                description=n["description"],
                severity=n["severity"],
                read=n["read"],
                action_route=n.get("action_route"),
            )
            session.add(notif)

        for a in ACTIVITIES_DATA:
            act = Activity(
                id=a["id"],
                type=a["type"],
                title=a["title"],
                description=a["description"],
            )
            session.add(act)

        await session.commit()
        print("[SUCCESS] CrewSense AI Database & Graph successfully seeded into Neon PostgreSQL!")


if __name__ == "__main__":
    asyncio.run(seed_all())
