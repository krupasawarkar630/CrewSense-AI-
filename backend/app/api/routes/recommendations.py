"""CrewSense AI — Recommendation & Decision Approval Routes."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.recommendation import RecommendationOut, RecommendationActionResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=ApiResponse[List[RecommendationOut]])
async def list_recommendations(session: AsyncSession = Depends(get_db)):
    """List all AI-generated actionable recommendations."""
    recs = await recommendation_service.get_all_recommendations(session)
    return ApiResponse.ok(recs)


@router.post("/{rec_id}/approve", response_model=ApiResponse[RecommendationActionResponse])
async def approve_recommendation(
    rec_id: str,
    current_user: User | None = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Approve AI recommendation: applies change, logs audit trail, and recalculates."""
    res = await recommendation_service.approve_recommendation(
        session=session,
        rec_id=rec_id,
        user_id=current_user.id if current_user else "user-manager-1",
    )
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation {rec_id} not found",
        )
    return ApiResponse.ok(res)


@router.post("/{rec_id}/reject", response_model=ApiResponse[RecommendationActionResponse])
async def reject_recommendation(
    rec_id: str,
    current_user: User | None = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Reject AI recommendation and log audit."""
    res = await recommendation_service.reject_recommendation(
        session=session,
        rec_id=rec_id,
        user_id=current_user.id if current_user else "user-manager-1",
    )
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation {rec_id} not found",
        )
    return ApiResponse.ok(res)
