"""CrewSense AI — What-If Simulation Routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.common import ApiResponse
from app.schemas.simulation import SimulationRequest, SimulationResponseOut
from app.simulations.what_if_engine import run_what_if_simulation

router = APIRouter(prefix="/simulations", tags=["Simulations"])


@router.post("", response_model=ApiResponse[SimulationResponseOut])
async def simulate(
    req: SimulationRequest,
    session: AsyncSession = Depends(get_db),
):
    """Run in-memory what-if scenario simulation without mutating production state."""
    res = await run_what_if_simulation(req.scenario, session)
    return ApiResponse.ok(res)
