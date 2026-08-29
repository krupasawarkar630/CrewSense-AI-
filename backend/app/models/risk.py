"""CrewSense AI — Risk Intelligence Models."""

from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Risk(Base):
    __tablename__ = "risks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False)  # workload / deadline / dependency / skill / capacity
    severity: Mapped[str] = mapped_column(String(32), default="medium")  # critical / high / medium / low / none
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    affected_project_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    affected_employee_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("employees.id", ondelete="CASCADE"), nullable=True)
    affected_task_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=True)
    probability: Mapped[int] = mapped_column(Integer, default=50)
    impact: Mapped[str] = mapped_column(String(255), default="")
    recommendation: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_active: Mapped[bool] = mapped_column(default=True)
