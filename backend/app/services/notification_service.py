"""CrewSense AI — Notification & Activity Service."""

from __future__ import annotations

from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, Activity
from app.schemas.dashboard import NotificationOut, ActivityOut


class NotificationService:
    @staticmethod
    async def get_notifications(session: AsyncSession) -> List[NotificationOut]:
        """Fetch all notifications ordered by newest first."""
        result = await session.execute(
            select(Notification).order_by(Notification.timestamp.desc())
        )
        notifs = list(result.scalars().all())
        return [
            NotificationOut(
                id=n.id,
                type=n.type,
                title=n.title,
                description=n.description or "",
                severity=n.severity,
                read=n.read,
                actionRoute=n.action_route,
                timestamp=n.timestamp.isoformat(),
            )
            for n in notifs
        ]

    @staticmethod
    async def get_activities(session: AsyncSession) -> List[ActivityOut]:
        """Fetch system activity feed."""
        result = await session.execute(
            select(Activity).order_by(Activity.timestamp.desc())
        )
        acts = list(result.scalars().all())
        return [
            ActivityOut(
                id=a.id,
                type=a.type,
                title=a.title,
                description=a.description or "",
                timestamp=a.timestamp.isoformat(),
                relatedEntityId=a.related_entity_id,
                relatedEntityType=a.related_entity_type,
            )
            for a in acts
        ]


notification_service = NotificationService()
