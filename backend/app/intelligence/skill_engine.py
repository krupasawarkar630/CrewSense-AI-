"""CrewSense AI — Skill Matching & Gap Detection Engine."""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from app.models.employee import Employee
from app.models.skill import Skill
from app.models.task import Task


def score_proficiency(prof: str) -> float:
    """Map string proficiency to normalized numeric score (0.0 to 1.0)."""
    mapping = {
        "strong": 1.0,
        "moderate": 0.7,
        "weak": 0.35,
        "missing": 0.0,
    }
    return mapping.get(prof.lower(), 0.0)


def calculate_candidate_match(
    employee: Employee,
    required_skill_ids: List[str],
    current_effective_workload: int,
    dependency_conflicts: int = 0,
) -> Dict[str, Any]:
    """
    Calculate multi-factor match score for an employee:
    - skill_match_score: weighted skill proficiency
    - capacity_score: headroom available
    - availability_score: low vs medium vs high availability
    - dependency_score: penalty for active downstream blocks
    - overall_score: composite suitability score
    """
    # 1. Skill Match Score
    if not required_skill_ids:
        skill_match_pct = 85
    else:
        emp_skills_dict = {
            es.skill_id: es.proficiency
            for es in (employee.skills or [])
        }
        total_score = 0.0
        for s_id in required_skill_ids:
            prof = emp_skills_dict.get(s_id, "missing")
            total_score += score_proficiency(prof)
        skill_match_pct = int(round((total_score / len(required_skill_ids)) * 100.0))

    # 2. Capacity Score (100% when workload <= 50%, scales down to 0% at 100%+)
    capacity_score = max(0, min(100, int(100 - max(0, current_effective_workload - 50) * 2)))

    # 3. Availability Score
    avail_map = {"high": 95, "medium": 75, "low": 40}
    availability_score = avail_map.get(employee.availability, 70)

    # 4. Dependency Score (100% when 0 conflicts)
    dependency_score = max(20, 100 - (dependency_conflicts * 25))

    # 5. Composite Overall Score
    overall_score = int(round(
        (skill_match_pct * 0.40) +
        (capacity_score * 0.25) +
        (availability_score * 0.20) +
        (dependency_score * 0.15)
    ))

    # Reasons generation
    reasons = []
    if skill_match_pct >= 85:
        reasons.append(f"Strong match across required skills ({skill_match_pct}%)")
    elif skill_match_pct >= 70:
        reasons.append(f"Moderate skill coverage ({skill_match_pct}%)")
    
    if current_effective_workload < 75:
        reasons.append(f"Available capacity: {100 - current_effective_workload}%")
    else:
        reasons.append(f"Warning: high current workload ({current_effective_workload}%)")

    if dependency_conflicts == 0:
        reasons.append("No dependency conflicts")
    else:
        reasons.append(f"{dependency_conflicts} active dependency conflicts")

    return {
        "employee_id": employee.id,
        "employee_name": employee.name,
        "role": employee.role,
        "skill_match": skill_match_pct,
        "capacity_score": capacity_score,
        "availability_score": availability_score,
        "dependency_conflicts": dependency_conflicts,
        "recommendation_score": overall_score,
        "reasons": reasons,
    }


def detect_skill_gaps(
    required_skills: List[str],
    all_employees: List[Employee],
) -> List[Dict[str, Any]]:
    """
    Detect missing or weak skill coverage across all team members for required skills.
    """
    gaps = []
    for skill_name in required_skills:
        # Match by name or normalized id
        norm_name = skill_name.lower().replace(" ", "").replace(".", "").replace("-", "")
        
        qualified_count = 0
        partial_matches = []

        for emp in all_employees:
            for es in (emp.skills or []):
                s_name = (es.skill.name if es.skill else es.skill_id).lower().replace(" ", "").replace(".", "").replace("-", "")
                if norm_name in s_name or s_name in norm_name:
                    if es.proficiency == "strong":
                        qualified_count += 1
                    elif es.proficiency in ("moderate", "weak"):
                        partial_matches.append({
                            "employeeId": emp.id,
                            "employeeName": emp.name,
                            "matchPercent": 71 if es.proficiency == "moderate" else 45,
                        })

        if qualified_count == 0:
            solutions = []
            if partial_matches:
                top_partial = partial_matches[0]
                solutions.append({
                    "type": "partial_match",
                    "description": f"Assign {top_partial.get('employeeName', 'candidate')} with upskilling plan",
                    "employeeId": top_partial.get("employeeId"),
                    "matchPercent": top_partial.get("matchPercent"),
                    "impact": f"{top_partial.get('matchPercent')}% skill coverage, may need mentoring support",
                })
            solutions.append({
                "type": "add_capacity",
                "description": f"Contract or hire a dedicated {skill_name} specialist",
                "impact": "100% full skill coverage, additional budget required",
            })
            solutions.append({
                "type": "change_requirement",
                "description": f"Reduce scope or dependency on {skill_name}",
                "impact": "Lower scope complexity, accelerated timeline",
            })

            gaps.append({
                "skillName": skill_name,
                "qualifiedEmployees": qualified_count,
                "partialMatches": partial_matches,
                "solutions": solutions,
            })

    return gaps
