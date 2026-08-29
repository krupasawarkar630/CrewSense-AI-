"""CrewSense AI — Auth Schemas."""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "employee"  # "manager" | "employee"
    employee_id: Optional[str] = None


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    employee_id: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
