"""CrewSense AI — Recommendation & Decision Approval Service."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recommendation import Recommendation
from app.models.notification import AuditLog
from app.models.task import Task
from app.schemas.recommendation import (
    RecommendationOut,
    RecommendationActionResponse,
    ExpectedImpactOut,
)
from app.services.task_service import task_service


class RecommendationService:
    @staticmethod
    async def get_all_recommendations(session: AsyncSession) -> List[RecommendationOut]:
        """Fetch all pending and historical recommendations."""
        result = await session.execute(select(Recommendation).order_by(Recommendation.created_at.desc()))
        recs = list(result.scalars().all())

        return [
            RecommendationOut(
                id=r.id,
                type=r.type,
                title=r.title,
                description=r.description or "",
                reason=r.reason or "",
                affectedEmployeeId=r.affected_employee_id,
                affectedTaskId=r.affected_task_id,
                affectedProjectId=r.affected_project_id,
                fromEmployeeId=r.from_employee_id,
                toEmployeeId=r.to_employee_id,
                expectedImpact=ExpectedImpactOut(**(r.expected_impact or {})),
                confidence=r.confidence,
                status=r.status,
                createdAt=r.created_at.isoformat(),
            )
            for r in recs
        ]

    @staticmethod
    async def approve_recommendation(
        session: AsyncSession,
        rec_id: str,
        user_id: Optional[str] = None,
    ) -> Optional[RecommendationActionResponse]:
        """Approve AI recommendation, apply change, log audit, and recalculate."""
        rec = await session.get(Recommendation, rec_id)
        if not rec:
            return None

        rec.status = "approved"
        rec.resolved_at = datetime.now(timezone.utc)

        applied = []
        # If it's a task reassignment, apply it to the database
        if rec.type == "reassign_task" and rec.affected_task_id and rec.to_employee_id:
            await task_service.assign_task(
                session=session,
                task_id=rec.affected_task_id,
                employee_id=rec.to_employee_id,
            )
            applied.append(f"Reassigned task {rec.affected_task_id} to {rec.to_employee_id}")

        # Write to Audit Log (Section 22)
        audit = AuditLog(
            id=f"audit-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            user_id=user_id or "user-manager-1",
            action="approve_recommendation",
            entity_type="recommendation",
            entity_id=rec.id,
            details={"title": rec.title, "applied": applied},
        )
        session.add(audit)
        await session.commit()
        await session.refresh(rec)

        rec_out = RecommendationOut(
            id=rec.id,
            type=rec.type,
            title=rec.title,
            description=rec.description or "",
            reason=rec.reason or "",
            affectedEmployeeId=rec.affected_employee_id,
            affectedTaskId=rec.affected_task_id,
            affectedProjectId=rec.affected_project_id,
            fromEmployeeId=rec.from_employee_id,
            toEmployeeId=rec.to_employee_id,
            expectedImpact=ExpectedImpactOut(**(rec.expected_impact or {})),
            confidence=rec.confidence,
            status=rec.status,
            createdAt=rec.created_at.isoformat(),
        )

        return RecommendationActionResponse(
            recommendation=rec_out,
            appliedChanges=applied,
            message="Plan approved and applied. Workloads and delivery risks recalculated.",
        )

    @staticmethod
    async def reject_recommendation(
        session: AsyncSession,
        rec_id: str,
        user_id: Optional[str] = None,
    ) -> Optional[RecommendationActionResponse]:
        """Reject AI recommendation and log audit."""
        rec = await session.get(Recommendation, rec_id)
        if not rec:
            return None

        rec.status = "rejected"
        rec.resolved_at = datetime.now(timezone.utc)

        audit = AuditLog(
            id=f"audit-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            user_id=user_id or "user-manager-1",
            action="reject_recommendation",
            entity_type="recommendation",
            entity_id=rec.id,
            details={"title": rec.title},
        )
        session.add(audit)
        await session.commit()
        await session.refresh(rec)

        rec_out = RecommendationOut(
            id=rec.id,
            type=rec.type,
            title=rec.title,
            description=rec.description or "",
            reason=rec.reason or "",
            affectedEmployeeId=rec.affected_employee_id,
            affectedTaskId=rec.affected_task_id,
            affectedProjectId=rec.affected_project_id,
            fromEmployeeId=rec.from_employee_id,
            toEmployeeId=rec.to_employee_id,
            expectedImpact=ExpectedImpactOut(**(rec.expected_impact or {})),
            confidence=rec.confidence,
            status=rec.status,
            createdAt=rec.created_at.isoformat(),
        )

        return RecommendationActionResponse(
            recommendation=rec_out,
            appliedChanges=[],
            message="Recommendation rejected.",
        )


recommendation_service = RecommendationService()
