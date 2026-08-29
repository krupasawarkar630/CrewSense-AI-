"""CrewSense AI — Resource Optimization Routes."""

from __future__ import annotations

from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.common import ApiResponse
from app.schemas.simulation import (
    SimulationResponseOut,
    SimulationOut,
    SimulationComparisonOut,
    SimulationResultsOut,
    SimulationChangeOut,
)
from app.agent.tools import tool_optimize_allocations

router = APIRouter(prefix="/optimization", tags=["Optimization"])


@router.post("/team", response_model=ApiResponse[SimulationResponseOut])
async def optimize_team(session: AsyncSession = Depends(get_db)):
    """Run global workforce optimization algorithm across all 24 team members."""
    opt = await tool_optimize_allocations(session)

    current_res = SimulationResultsOut(**opt["current"])
    proposed_res = SimulationResultsOut(**opt["proposed"])
    changes = [SimulationChangeOut(**c) for c in opt["changes"]]

    sim_out = SimulationOut(
        id="sim-opt-global",
        name="Global Team Optimization Plan",
        description="Autonomous workforce rebalancing",
        scenario="Optimize team allocations across all active projects",
        changes=changes,
        results=proposed_res,
        createdAt="2025-08-29T10:00:00Z",
    )

    return ApiResponse.ok(SimulationResponseOut(
        simulation=sim_out,
        comparison=SimulationComparisonOut(
            current=current_res,
            proposed=proposed_res,
        ),
        agentRecommendation=opt["recommendation"],
    ))
