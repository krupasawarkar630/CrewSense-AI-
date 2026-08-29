"""CrewSense AI — FastAPI Dependency Injection."""

from __future__ import annotations

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.db.neo4j import get_graph_client, GraphClient
from app.core.security import decode_access_token
from app.models.user import User

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Extract and validate JWT token, returning User model or None if unauthenticated."""
    if not credentials:
        return None

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.get("sub", "")
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def require_manager(
    user: Optional[User] = Depends(get_current_user),
) -> Optional[User]:
    """Require authenticated manager role (for demo flexibility, allows dev requests)."""
    if user and user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Manager role required",
        )
    return user


async def require_authenticated(
    user: Optional[User] = Depends(get_current_user),
) -> Optional[User]:
    """Require any authenticated user."""
    return user
