from dataclasses import dataclass, replace

from app.projects.domain import Project, ProjectFields, ProjectStore
from app.shared.clock import Clock, utc_now
from app.shared.errors import ConflictError, NotFoundError
from app.shared.slug import slugify


@dataclass(frozen=True, slots=True)
class ProjectDraft:
    """What the admin submits: without a slug, one is derived from the title."""

    fields: ProjectFields
    slug_given: bool


class ProjectService:
    def __init__(self, store: ProjectStore, clock: Clock = utc_now) -> None:
        self._store = store
        self._clock = clock

    async def list_published(self) -> list[Project]:
        return await self._store.list(published_only=True)

    async def require_published(self, slug: str) -> Project:
        project = await self._store.get_by_slug(slug)
        if project is None or not project.fields.published:
            raise NotFoundError("Project not found")
        return project

    async def list_all(self) -> list[Project]:
        return await self._store.list(published_only=False)

    async def require(self, project_id: str) -> Project:
        project = await self._store.get(project_id)
        if project is None:
            raise NotFoundError("Project not found")
        return project

    async def create(self, draft: ProjectDraft) -> Project:
        fields = await self._resolve(draft, current_id=None)
        return await self._store.add(fields, self._clock())

    async def update(self, project_id: str, draft: ProjectDraft) -> Project:
        fields = await self._resolve(draft, current_id=project_id)
        project = await self._store.replace(project_id, fields, self._clock())
        if project is None:
            raise NotFoundError("Project not found")
        return project

    async def delete(self, project_id: str) -> None:
        if not await self._store.delete(project_id):
            raise NotFoundError("Project not found")

    async def _resolve(self, draft: ProjectDraft, current_id: str | None) -> ProjectFields:
        slug = slugify(draft.fields.slug if draft.slug_given else draft.fields.title)
        if not slug:
            raise ConflictError("The title or slug must contain letters or digits")
        holder = await self._store.get_by_slug(slug)
        if holder is not None and holder.id != current_id:
            raise ConflictError(f"Another project already uses the slug '{slug}'")
        return replace(draft.fields, slug=slug)
