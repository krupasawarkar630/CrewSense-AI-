"""CrewSense AI — Google Gemini Deep Reasoning Provider."""

from __future__ import annotations

from typing import Any, Dict, Optional
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.logging import get_logger
from app.agent.prompts import AGENT_SYSTEM_PROMPT

logger = get_logger("agent.gemini")


class GeminiProvider:
    """Google Gemini API provider for multi-factor workforce analysis and long-context reasoning."""

    def __init__(self) -> None:
        self.api_key = settings.gemini_api_key
        self.client: Optional[genai.Client] = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as exc:
                logger.warning("Could not initialize Gemini client", error=str(exc))

    @property
    def is_available(self) -> bool:
        return self.client is not None

    async def generate(
        self,
        prompt: str,
        context: Optional[str] = None,
        model: str = "gemini-2.5-flash",
    ) -> str:
        """Generate response with deep context analysis."""
        if not self.is_available or not self.client:
            return ""

        full_prompt = f"{AGENT_SYSTEM_PROMPT}\n\n"
        if context:
            full_prompt += f"WORKFORCE CONTEXT DATA:\n{context}\n\n"
        full_prompt += f"MANAGER QUERY:\n{prompt}"

        try:
            # Call genai client asynchronously or in threadpool
            response = self.client.models.generate_content(
                model=model,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                ),
            )
            return response.text or ""
        except Exception as exc:
            logger.error("Gemini generation failed", error=str(exc))
            return ""


gemini_provider = GeminiProvider()
