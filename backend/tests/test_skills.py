"""CrewSense AI — Skill Match & Gap Engine Tests."""

import pytest
from app.models.employee import Employee, EmployeeSkill
from app.models.skill import Skill
from app.intelligence.skill_engine import calculate_candidate_match, detect_skill_gaps


def test_candidate_matching():
    emp = Employee(
        id="emp-1",
        name="Priya",
        role="Full Stack Dev",
        department="Engineering",
        email="priya@test.com",
        availability="high",
        skills=[
            EmployeeSkill(skill_id="sk-react", proficiency="strong", years_of_experience=4),
            EmployeeSkill(skill_id="sk-fastapi", proficiency="strong", years_of_experience=3),
        ],
    )

    match = calculate_candidate_match(
        employee=emp,
        required_skill_ids=["sk-react", "sk-fastapi"],
        current_effective_workload=60,
    )

    assert match["skill_match"] == 100
    assert match["recommendation_score"] >= 85


def test_skill_gap_detection():
    emp = Employee(
        id="emp-1",
        name="Rahul",
        role="Frontend",
        department="Engineering",
        email="rahul@test.com",
        skills=[EmployeeSkill(skill_id="sk-react", proficiency="strong", years_of_experience=4)],
    )

    gaps = detect_skill_gaps(
        required_skills=["Kubernetes", "Marketing Automation"],
        all_employees=[emp],
    )

    assert len(gaps) == 2
    assert gaps[0]["qualifiedEmployees"] == 0
