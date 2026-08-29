"""CrewSense AI — Project Models."""

from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(32), default="active")  # active / planning / at_risk / completed / on_hold
    priority: Mapped[str] = mapped_column(String(32), default="medium")  # critical / high / medium / low
    progress: Mapped[int] = mapped_column(Integer, default=0)
    start_date: Mapped[str] = mapped_column(String(32), default="2025-08-01")
    deadline: Mapped[str] = mapped_column(String(32), default="2025-09-30")
    projected_completion: Mapped[str] = mapped_column(String(32), default="2025-09-30")
    delay_probability: Mapped[int] = mapped_column(Integer, default=0)
    risk_level: Mapped[str] = mapped_column(String(32), default="low")  # critical / high / medium / low / none
    health_score: Mapped[int] = mapped_column(Integer, default=85)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    client: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    members = relationship("ProjectMember", back_populates="project", lazy="selectin", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", lazy="selectin", cascade="all, delete-orphan")
    required_skills = relationship("ProjectSkillRequirement", back_populates="project", lazy="selectin", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    employee_id: Mapped[str] = mapped_column(String(64), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    role_in_project: Mapped[str] = mapped_column(String(128), default="Contributor")

    project = relationship("Project", back_populates="members")
    employee = relationship("Employee", back_populates="project_memberships")


class ProjectSkillRequirement(Base):
    __tablename__ = "project_skill_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name: Mapped[str] = mapped_column(String(128), nullable=False)

    project = relationship("Project", back_populates="required_skills")
