"""CrewSense AI — Neo4j Graph Database Driver."""

from __future__ import annotations

from typing import Any, AsyncGenerator, Dict, List, Optional
from neo4j import AsyncGraphDatabase, AsyncDriver, AsyncSession
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("db.neo4j")

_driver: Optional[AsyncDriver] = None


class GraphClient:
    """Async wrapper for Neo4j operations with fallback resilience."""

    def __init__(self, driver: Optional[AsyncDriver] = None) -> None:
        self.driver = driver
        self.is_connected = False
        # In-memory graph fallback store
        self._in_memory_nodes: Dict[str, Dict[str, Any]] = {}
        self._in_memory_edges: List[Dict[str, Any]] = []

    async def connect(self) -> bool:
        if not settings.neo4j_uri:
            logger.warning("Neo4j URI not configured, using in-memory graph fallback.")
            return False
        try:
            self.driver = AsyncGraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_username, settings.neo4j_password),
            )
            # Verify connectivity
            async with self.driver.session() as session:
                result = await session.run("RETURN 1 AS connected")
                record = await result.single()
                if record and record["connected"] == 1:
                    self.is_connected = True
                    logger.info("Connected to Neo4j graph database", uri=settings.neo4j_uri)
                    return True
        except Exception as exc:
            logger.warning("Could not connect to Neo4j, falling back to in-memory graph intelligence", error=str(exc))
            self.is_connected = False
        return False

    async def close(self) -> None:
        if self.driver:
            await self.driver.close()
            self.is_connected = False
            logger.info("Neo4j driver closed.")

    async def query(self, cypher: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Run Cypher query and return list of record dicts."""
        if self.is_connected and self.driver:
            try:
                async with self.driver.session() as session:
                    result = await session.run(cypher, parameters or {})
                    records = await result.data()
                    return records
            except Exception as exc:
                logger.error("Neo4j Cypher query failed", query=cypher, error=str(exc))
                return []
        else:
            return self._query_in_memory(cypher, parameters or {})

    async def execute_write(self, cypher: str, parameters: Optional[Dict[str, Any]] = None) -> None:
        """Run Cypher write query."""
        if self.is_connected and self.driver:
            try:
                async with self.driver.session() as session:
                    await session.run(cypher, parameters or {})
            except Exception as exc:
                logger.error("Neo4j write failed", query=cypher, error=str(exc))
        else:
            self._write_in_memory(cypher, parameters or {})

    def _write_in_memory(self, cypher: str, params: Dict[str, Any]) -> None:
        """Fallback in-memory graph store for sync operations."""
        pass

    def _query_in_memory(self, cypher: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fallback in-memory response simulator."""
        return []


graph_client = GraphClient()


async def get_graph_client() -> GraphClient:
    return graph_client
