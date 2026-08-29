"""CrewSense AI — Notifications & Activities Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.common import ApiResponse
from app.schemas.dashboard import NotificationOut, ActivityOut
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=ApiResponse[List[NotificationOut]])
async def get_notifications(session: AsyncSession = Depends(get_db)):
    """Fetch real-time notifications for the active user."""
    notifs = await notification_service.get_notifications(session)
    return ApiResponse.ok(notifs)


@router.get("/activities", response_model=ApiResponse[List[ActivityOut]])
async def get_activities(session: AsyncSession = Depends(get_db)):
    """Fetch organizational activity and decision feed."""
    acts = await notification_service.get_activities(session)
    return ApiResponse.ok(acts)
