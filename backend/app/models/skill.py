"""CrewSense AI — Skill Model."""

from __future__ import annotations

from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)  # "Frontend", "Backend", "Design", etc.
    demand: Mapped[int] = mapped_column(Integer, default=0)

    employee_skills = relationship("EmployeeSkill", back_populates="skill", cascade="all, delete-orphan")
    task_requirements = relationship("TaskSkillRequirement", back_populates="skill", cascade="all, delete-orphan")
