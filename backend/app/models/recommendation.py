"""CrewSense AI — Recommendation & Decision Models."""

from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    type: Mapped[str] = mapped_column(String(64), nullable=False)  # reassign_task / add_resource / rebalance / skill_gap / dependency_resolution
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    reason: Mapped[str] = mapped_column(Text, default="")
    affected_employee_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    affected_task_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    affected_project_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    from_employee_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    to_employee_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    expected_impact: Mapped[dict] = mapped_column(JSON, default=dict)  # {"workloadChange": -23, "riskReduction": 40, ...}
    confidence: Mapped[int] = mapped_column(Integer, default=90)
    status: Mapped[str] = mapped_column(String(32), default="pending")  # pending / approved / rejected / simulated
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
