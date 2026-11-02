from datetime import datetime
from typing import Annotated, Self

from fastapi import APIRouter, Depends, status
from pydantic import Field, HttpUrl, StringConstraints

from app.auth.api import require_admin
from app.dependencies import ServicesDep
from app.projects.application import ProjectDraft
from app.projects.domain import Project, ProjectFields
from app.shared.schemas import LocalizedLong, LocalizedShort, Schema, ShortText

Slug = Annotated[str, StringConstraints(strip_whitespace=True, max_length=80, pattern=r"^[a-z0-9-]*$")]
StackItem = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=40)]


class ProjectBody(Schema):
    title: ShortText
    slug: Slug | None = None
    summary: LocalizedShort
    description: LocalizedLong
    stack: Annotated[list[StackItem], Field(default_factory=list, max_length=20)]
    repo_url: HttpUrl | None = None
    live_url: HttpUrl | None = None
    cover_url: HttpUrl | None = None
    featured: bool = False
    published: bool = False
    position: Annotated[int, Field(ge=0, le=10_000)] = 0

    def to_draft(self) -> ProjectDraft:
        fields = ProjectFields(
            slug=self.slug or "",
            title=self.title,
            summary=self.summary.to_domain(),
            description=self.description.to_domain(),
            stack=tuple(self.stack),
            repo_url=_str(self.repo_url),
            live_url=_str(self.live_url),
            cover_url=_str(self.cover_url),
            featured=self.featured,
            published=self.published,
            position=self.position,
        )
        return ProjectDraft(fields=fields, slug_given=bool(self.slug))


class ProjectResponse(Schema):
    id: str
    slug: str
    title: str
    summary: LocalizedShort
    description: LocalizedLong
    stack: list[str]
    repo_url: str | None
    live_url: str | None
    cover_url: str | None
    featured: bool
    published: bool
    position: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def of(cls, project: Project) -> Self:
        f = project.fields
        return cls(
            id=project.id,
            slug=f.slug,
            title=f.title,
            summary=LocalizedShort.of(f.summary),
            description=LocalizedLong.of(f.description),
            stack=list(f.stack),
            repo_url=f.repo_url,
            live_url=f.live_url,
            cover_url=f.cover_url,
            featured=f.featured,
            published=f.published,
            position=f.position,
            created_at=project.created_at,
            updated_at=project.updated_at,
        )


def _str(url: HttpUrl | None) -> str | None:
    return str(url) if url else None


public = APIRouter(prefix="/api/projects", tags=["projects"])
admin = APIRouter(prefix="/api/admin/projects", tags=["projects"], dependencies=[Depends(require_admin)])


@public.get("")
async def list_projects(services: ServicesDep) -> list[ProjectResponse]:
    return [ProjectResponse.of(p) for p in await services.projects.list_published()]


@public.get("/{slug}")
async def get_project(slug: str, services: ServicesDep) -> ProjectResponse:
    return ProjectResponse.of(await services.projects.require_published(slug))


@admin.get("")
async def list_all_projects(services: ServicesDep) -> list[ProjectResponse]:
    return [ProjectResponse.of(p) for p in await services.projects.list_all()]


@admin.get("/{project_id}")
async def get_any_project(project_id: str, services: ServicesDep) -> ProjectResponse:
    return ProjectResponse.of(await services.projects.require(project_id))


@admin.post("", status_code=status.HTTP_201_CREATED)
async def create_project(body: ProjectBody, services: ServicesDep) -> ProjectResponse:
    return ProjectResponse.of(await services.projects.create(body.to_draft()))


@admin.put("/{project_id}")
async def update_project(project_id: str, body: ProjectBody, services: ServicesDep) -> ProjectResponse:
    return ProjectResponse.of(await services.projects.update(project_id, body.to_draft()))


@admin.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, services: ServicesDep) -> None:
    await services.projects.delete(project_id)
