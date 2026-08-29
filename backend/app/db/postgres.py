"""CrewSense AI — PostgreSQL Database Connection."""

from __future__ import annotations

import ssl
from typing import AsyncGenerator
from urllib.parse import urlparse, parse_qs, urlunparse
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("db.postgres")


class Base(DeclarativeBase):
    """Base model for all SQLAlchemy entities."""
    pass


def prepare_database_url_and_args(raw_url: str):
    """
    Format connection string for asyncpg and handle Neon / SSL / PgBouncer parameters cleanly.
    """
    url = raw_url.strip()

    # Normalize driver scheme for asyncpg
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)

    is_sqlite = url.startswith("sqlite")
    connect_args: dict = {}

    if is_sqlite:
        connect_args["check_same_thread"] = False
    elif "asyncpg" in url:
        # Parse query params for SSL
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        has_ssl = "sslmode" in params or "ssl" in params or "neon.tech" in url

        if has_ssl:
            # asyncpg accepts ssl context
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            connect_args["ssl"] = ctx

        # Disable prepared statement caching for PgBouncer / Neon poolers
        connect_args["statement_cache_size"] = 0
        connect_args["prepared_statement_cache_size"] = 0

        # Clean query string for asyncpg (strip parameters that asyncpg doesn't recognize directly in URL)
        clean_url = urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            "",  # empty query
            parsed.fragment,
        ))
        url = clean_url

    return url, connect_args


formatted_url, engine_connect_args = prepare_database_url_and_args(settings.database_url)

engine: AsyncEngine = create_async_engine(
    formatted_url,
    echo=settings.debug and False,
    future=True,
    connect_args=engine_connect_args,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for injecting async SQLAlchemy sessions."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception as exc:
            await session.rollback()
            logger.error("Database transaction rolled back", error=str(exc))
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Create all tables in the database."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("PostgreSQL database tables initialized.")
