from typing import Annotated, Self

from fastapi import APIRouter, Depends, status
from pydantic import Field, StringConstraints

from app.auth.api import require_admin
from app.dependencies import ServicesDep
from app.shared.schemas import Schema, ShortText
from app.skills.domain import Skill, SkillCategory, SkillFields

IconSlug = Annotated[str, StringConstraints(strip_whitespace=True, max_length=60, pattern=r"^[a-z0-9]+$")]


class SkillBody(Schema):
    name: ShortText
    category: SkillCategory
    icon: IconSlug | None = None
    position: Annotated[int, Field(ge=0, le=10_000)] = 0

    def to_domain(self) -> SkillFields:
        return SkillFields(
            name=self.name, category=self.category, icon=self.icon or None, position=self.position
        )


class SkillResponse(Schema):
    id: str
    name: str
    category: SkillCategory
    icon: str | None
    position: int

    @classmethod
    def of(cls, skill: Skill) -> Self:
        f = skill.fields
        return cls(id=skill.id, name=f.name, category=f.category, icon=f.icon, position=f.position)


public = APIRouter(prefix="/api/skills", tags=["skills"])
admin = APIRouter(prefix="/api/admin/skills", tags=["skills"], dependencies=[Depends(require_admin)])


@public.get("")
async def list_skills(services: ServicesDep) -> list[SkillResponse]:
    return [SkillResponse.of(s) for s in await services.skills.list()]


@admin.post("", status_code=status.HTTP_201_CREATED)
async def create_skill(body: SkillBody, services: ServicesDep) -> SkillResponse:
    return SkillResponse.of(await services.skills.create(body.to_domain()))


@admin.put("/{skill_id}")
async def update_skill(skill_id: str, body: SkillBody, services: ServicesDep) -> SkillResponse:
    return SkillResponse.of(await services.skills.update(skill_id, body.to_domain()))


@admin.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(skill_id: str, services: ServicesDep) -> None:
    await services.skills.delete(skill_id)
