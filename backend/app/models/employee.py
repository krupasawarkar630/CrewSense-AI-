"""CrewSense AI — Employee & Capacity Models."""

from __future__ import annotations

from datetime import datetime, date, timezone
from sqlalchemy import String, Integer, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar: Mapped[str] = mapped_column(String(8), default="EM")
    role: Mapped[str] = mapped_column(String(128), nullable=False)
    department: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=100)  # Nominal hours %
    availability: Mapped[str] = mapped_column(String(32), default="high")  # high / medium / low
    workload_status: Mapped[str] = mapped_column(String(32), default="healthy")  # healthy / watch / high_load / overloaded
    joined_date: Mapped[str] = mapped_column(String(32), default="2023-01-01")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="employee", uselist=False)
    skills = relationship("EmployeeSkill", back_populates="employee", lazy="selectin", cascade="all, delete-orphan")
    project_memberships = relationship("ProjectMember", back_populates="employee", lazy="selectin", cascade="all, delete-orphan")
    assigned_tasks = relationship("Task", back_populates="assignee", lazy="selectin")
    meetings = relationship("Meeting", back_populates="employee", lazy="selectin", cascade="all, delete-orphan")
    leaves = relationship("Leave", back_populates="employee", lazy="selectin", cascade="all, delete-orphan")


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    employee_id: Mapped[str] = mapped_column(String(64), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[str] = mapped_column(String(64), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency: Mapped[str] = mapped_column(String(32), default="moderate")  # strong / moderate / weak
    years_of_experience: Mapped[int] = mapped_column(Integer, default=1)

    employee = relationship("Employee", back_populates="skills")
    skill = relationship("Skill", back_populates="employee_skills", lazy="selectin")


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(64), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    hours_per_week: Mapped[float] = mapped_column(Float, default=2.0)
    is_recurring: Mapped[bool] = mapped_column(default=True)

    employee = relationship("Employee", back_populates="meetings")


class Leave(Base):
    __tablename__ = "leaves"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(64), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date: Mapped[str] = mapped_column(String(32), nullable=False)
    end_date: Mapped[str] = mapped_column(String(32), nullable=False)
    type: Mapped[str] = mapped_column(String(64), default="annual")  # annual / sick / casual

    employee = relationship("Employee", back_populates="leaves")
