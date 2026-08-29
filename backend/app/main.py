"""CrewSense AI — Main FastAPI Application Entrypoint."""

from __future__ import annotations

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.db.postgres import init_db
from app.db.neo4j import graph_client
from app.api.routes import (
    auth,
    employees,
    projects,
    tasks,
    skills,
    workload,
    dependencies,
    risks,
    simulations,
    recommendations,
    optimization,
    agent,
    notifications,
    dashboard,
    health,
)

setup_logging()
logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown events."""
    logger.info("Starting CrewSense AI Backend", env=settings.app_env)
    
    # 1. Initialize PostgreSQL tables
    try:
        await init_db()
        logger.info("Database schemas verified.")
    except Exception as exc:
        logger.warning("Could not auto-initialize DB tables on startup", error=str(exc))

    # 2. Connect Neo4j Graph
    await graph_client.connect()

    yield

    # Shutdown
    await graph_client.close()
    logger.info("CrewSense AI Backend stopped.")


app = FastAPI(
    title="CrewSense AI — Workforce Intelligence API",
    description=(
        "Autonomous AI workforce intelligence platform that reveals hidden work, "
        "predicts project delivery risks, models skills & dependencies, and optimizes team allocation."
    ),
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Exception Handlers ──────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format validation errors into consistent ApiResponse schema."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "data": None,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request parameters",
                "details": exc.errors(),
            },
            "timestamp": "",
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all error handler sanitizing production errors."""
    logger.error("Unhandled API error", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "data": None,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An error occurred while processing the request.",
            },
            "timestamp": "",
        },
    )


# ── Register API Routers ────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(health.router)  # /health
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(employees.router, prefix=API_PREFIX)
app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(tasks.router, prefix=API_PREFIX)
app.include_router(skills.router, prefix=API_PREFIX)
app.include_router(workload.router, prefix=API_PREFIX)
app.include_router(dependencies.router, prefix=API_PREFIX)
app.include_router(risks.router, prefix=API_PREFIX)
app.include_router(simulations.router, prefix=API_PREFIX)
app.include_router(recommendations.router, prefix=API_PREFIX)
app.include_router(optimization.router, prefix=API_PREFIX)
app.include_router(agent.router, prefix=API_PREFIX)
app.include_router(notifications.router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)


@app.get("/")
async def root():
    return {
        "service": "CrewSense AI API",
        "status": "operational",
        "docs": "/docs",
    }
