"""CrewSense AI — Simulation & What-If Models."""

from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base


class Simulation(Base):
    __tablename__ = "simulations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    scenario: Mapped[str] = mapped_column(Text, nullable=False)
    changes: Mapped[list] = mapped_column(JSON, default=list)  # [{"type": "reassign", "description": ...}]
    results: Mapped[dict] = mapped_column(JSON, default=dict)  # {"workloadBefore": 91, "workloadAfter": 68, ...}
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
