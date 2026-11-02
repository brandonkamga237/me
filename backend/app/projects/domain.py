from dataclasses import dataclass
from datetime import datetime
from typing import Protocol

from app.shared.i18n import Localized


@dataclass(frozen=True, slots=True)
class ProjectFields:
    """Everything the admin edits; the slug is the project's address on the site."""

    slug: str
    title: str
    summary: Localized
    description: Localized
    stack: tuple[str, ...]
    repo_url: str | None
    live_url: str | None
    cover_url: str | None
    featured: bool
    published: bool
    position: int


@dataclass(frozen=True, slots=True)
class Project:
    id: str
    fields: ProjectFields
    created_at: datetime
    updated_at: datetime


class ProjectStore(Protocol):
    async def list(self, *, published_only: bool) -> list[Project]:
        """Ordered by position, then newest first."""
        ...

    async def get(self, project_id: str) -> Project | None: ...

    async def get_by_slug(self, slug: str) -> Project | None: ...

    async def add(self, fields: ProjectFields, now: datetime) -> Project: ...

    async def replace(self, project_id: str, fields: ProjectFields, now: datetime) -> Project | None: ...

    async def delete(self, project_id: str) -> bool: ...
