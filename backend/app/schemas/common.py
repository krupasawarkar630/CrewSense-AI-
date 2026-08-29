"""CrewSense AI — Common Pydantic Response Schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Generic, Optional, TypeVar, Any
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class ApiResponse(BaseModel, Generic[T]):
    """Standardized API response wrapper matching frontend contract."""
    success: bool = True
    data: Optional[T] = None
    error: Optional[ErrorDetail] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        return cls(success=True, data=data, error=None)

    @classmethod
    def fail(cls, code: str, message: str, details: Optional[Any] = None) -> "ApiResponse[None]":
        return cls(success=False, data=None, error=ErrorDetail(code=code, message=message, details=details))
