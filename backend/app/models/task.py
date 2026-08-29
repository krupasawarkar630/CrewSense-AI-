"""CrewSense AI — Task & Dependency Models."""

from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    project_id: Mapped[str] = mapped_column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    assignee_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("employees.id", ondelete="SET NULL"), nullable=True, index=True)
    priority: Mapped[str] = mapped_column(String(32), default="medium")  # critical / high / medium / low
    status: Mapped[str] = mapped_column(String(32), default="todo")  # todo / in_progress / blocked / review / done
    deadline: Mapped[str] = mapped_column(String(32), default="2025-09-15")
    effort: Mapped[int] = mapped_column(Integer, default=16)  # Hours
    estimated_days: Mapped[int] = mapped_column(Integer, default=3)
    risk_level: Mapped[str] = mapped_column(String(32), default="none")  # critical / high / medium / low / none
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("Employee", back_populates="assigned_tasks")
    skill_requirements = relationship("TaskSkillRequirement", back_populates="task", lazy="selectin", cascade="all, delete-orphan")
    downstream_dependencies = relationship("TaskDependency", foreign_keys="TaskDependency.source_task_id", back_populates="source_task", cascade="all, delete-orphan")
    upstream_dependencies = relationship("TaskDependency", foreign_keys="TaskDependency.target_task_id", back_populates="target_task", cascade="all, delete-orphan")


class TaskDependency(Base):
    __tablename__ = "task_dependencies"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    source_task_id: Mapped[str] = mapped_column(String(64), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    target_task_id: Mapped[str] = mapped_column(String(64), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(32), default="depends_on")  # blocks / depends_on / related
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(32), default="active")  # resolved / active / blocked
    impact: Mapped[str] = mapped_column(String(255), default="")

    source_task = relationship("Task", foreign_keys=[source_task_id], back_populates="downstream_dependencies")
    target_task = relationship("Task", foreign_keys=[target_task_id], back_populates="upstream_dependencies")


class TaskSkillRequirement(Base):
    __tablename__ = "task_skill_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    task_id: Mapped[str] = mapped_column(String(64), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[str] = mapped_column(String(64), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance: Mapped[str] = mapped_column(String(32), default="required")  # required / preferred

    task = relationship("Task", back_populates="skill_requirements")
    skill = relationship("Skill", back_populates="task_requirements")
