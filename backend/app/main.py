from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pymongo import AsyncMongoClient

from app.auth import api as auth_api
from app.config import Settings, get_settings
from app.container import Services, mongo_services
from app.experiences import api as experiences_api
from app.messages import api as messages_api
from app.profile import api as profile_api
from app.projects import api as projects_api
from app.shared.http import register_error_handlers
from app.shared.mongo import Document
from app.skills import api as skills_api


def create_app(settings: Settings | None = None, services: Services | None = None) -> FastAPI:
    """Without `services`, the app connects to MongoDB on startup; tests pass in-memory ones."""
    settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        if services is not None:
            app.state.services = services
            yield
            return
        client: AsyncMongoClient[Document] = AsyncMongoClient(settings.mongo_uri, tz_aware=True)
        try:
            app.state.services = await mongo_services(client[settings.mongo_db], settings)
            yield
        finally:
            await client.close()

    # The API is only reachable from the web app's server, never from browsers: no CORS needed.
    app = FastAPI(
        title="me API",
        version="0.1.0",
        lifespan=lifespan,
        docs_url=None if settings.environment == "prod" else "/api/docs",
        redoc_url=None,
        openapi_url=None if settings.environment == "prod" else "/api/openapi.json",
    )
    register_error_handlers(app)
    app.include_router(auth_api.router)
    for module in (profile_api, projects_api, experiences_api, skills_api, messages_api):
        app.include_router(module.public)
        app.include_router(module.admin)

    @app.get("/api/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app
