"""CrewSense AI — Groq Fast Interactive LLM Provider."""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional
from groq import AsyncGroq
from app.core.config import settings
from app.core.logging import get_logger
from app.agent.prompts import AGENT_SYSTEM_PROMPT

logger = get_logger("agent.groq")


class GroqProvider:
    """Groq API provider for fast interactive chat and reasoning."""

    def __init__(self) -> None:
        self.api_key = settings.groq_api_key
        self.client: Optional[AsyncGroq] = None
        if self.api_key and self.api_key != "your_groq_api_key_here":
            try:
                self.client = AsyncGroq(api_key=self.api_key)
            except Exception as exc:
                logger.warning("Could not initialize Groq client", error=str(exc))

    @property
    def is_available(self) -> bool:
        return self.client is not None

    async def generate(
        self,
        prompt: str,
        context: Optional[str] = None,
        model: str = "llama-3.3-70b-versatile",
    ) -> str:
        """Generate fast interactive text response."""
        if not self.is_available or not self.client:
            return ""

        messages = [{"role": "system", "content": AGENT_SYSTEM_PROMPT}]
        if context:
            messages.append({"role": "system", "content": f"WORKFORCE CONTEXT DATA:\n{context}"})
        messages.append({"role": "user", "content": prompt})

        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.2,
                max_tokens=1024,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            logger.error("Groq generation failed", error=str(exc))
            return ""


groq_provider = GroqProvider()
