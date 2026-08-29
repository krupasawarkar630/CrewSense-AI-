"""CrewSense AI — Application Configuration."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ─────────────────────────────────────────
    app_env: str = "development"
    app_name: str = "CrewSense AI"
    app_version: str = "1.0.0"
    debug: bool = True

    # ── PostgreSQL ──────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://crewsense:crewsense@localhost:5432/crewsense"

    # ── Neo4j ───────────────────────────────────────────────
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "crewsense"

    # ── AI Providers ────────────────────────────────────────
    groq_api_key: str = ""
    gemini_api_key: str = ""

    # ── JWT ─────────────────────────────────────────────────
    jwt_secret: str = "change-me-to-a-strong-random-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    # ── CORS ────────────────────────────────────────────────
    frontend_url: str = "http://localhost:3000"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url, "http://localhost:3000", "http://localhost:3001"]


settings = Settings()
