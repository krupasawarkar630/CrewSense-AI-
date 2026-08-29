"""CrewSense AI — Authentication Routes."""

from __future__ import annotations

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.core.security import verify_password, hash_password, create_access_token
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(req: LoginRequest, session: AsyncSession = Depends(get_db)):
    """Authenticate user with email/password and return JWT token."""
    result = await session.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    # For seamless demo testing: If password is "demo123" or correct hash
    valid_password = False
    if user:
        valid_password = verify_password(req.password, user.hashed_password) or req.password == "demo123"

    if not user or not valid_password:
        # Auto-create demo user on the fly if testing
        if req.password == "demo123":
            role = "manager" if "alex" in req.email.lower() or "manager" in req.email.lower() else "employee"
            emp_id = "emp-rahul" if role == "employee" else None
            user = User(
                id=f"user-{req.email.split('@')[0]}",
                email=req.email,
                name="Alex Morgan" if role == "manager" else "Rahul Sharma",
                hashed_password=hash_password(req.password),
                role=role,
                employee_id=emp_id,
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    user_out = UserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        employee_id=user.employee_id,
    )
    return ApiResponse.ok(TokenResponse(access_token=token, token_type="bearer", user=user_out))


@router.post("/register", response_model=ApiResponse[UserOut])
async def register(req: RegisterRequest, session: AsyncSession = Depends(get_db)):
    """Register a new user."""
    existing = await session.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = User(
        id=f"user-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
        role=req.role,
        employee_id=req.employee_id,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return ApiResponse.ok(UserOut.from_orm(user))


@router.get("/me", response_model=ApiResponse[UserOut])
async def get_me(current_user: User = Depends(get_current_user)):
    """Return currently authenticated user profile."""
    if not current_user:
        # Return fallback demo manager for convenience
        return ApiResponse.ok(UserOut(
            id="user-alex",
            email="alex@crewsense.ai",
            name="Alex Morgan",
            role="manager",
        ))
    return ApiResponse.ok(UserOut.from_orm(current_user))
