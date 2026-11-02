from datetime import date
from typing import Self

from fastapi import APIRouter, Depends, status
from pydantic import HttpUrl

from app.auth.api import require_admin
from app.dependencies import ServicesDep
from app.experiences.domain import Experience, ExperienceFields
from app.shared.schemas import LocalizedLong, LocalizedShort, Schema, ShortText


class ExperienceBody(Schema):
    company: ShortText
    role: LocalizedShort
    location: ShortText
    start: date
    end: date | None = None
    description: LocalizedLong
    url: HttpUrl | None = None

    def to_domain(self) -> ExperienceFields:
        return ExperienceFields(
            company=self.company,
            role=self.role.to_domain(),
            location=self.location,
            start=self.start,
            end=self.end,
            description=self.description.to_domain(),
            url=str(self.url) if self.url else None,
        )


class ExperienceResponse(Schema):
    id: str
    company: str
    role: LocalizedShort
    location: str
    start: date
    end: date | None
    description: LocalizedLong
    url: str | None

    @classmethod
    def of(cls, experience: Experience) -> Self:
        f = experience.fields
        return cls(
            id=experience.id,
            company=f.company,
            role=LocalizedShort.of(f.role),
            location=f.location,
            start=f.start,
            end=f.end,
            description=LocalizedLong.of(f.description),
            url=f.url,
        )


public = APIRouter(prefix="/api/experiences", tags=["experiences"])
admin = APIRouter(
    prefix="/api/admin/experiences", tags=["experiences"], dependencies=[Depends(require_admin)]
)


@public.get("")
async def list_experiences(services: ServicesDep) -> list[ExperienceResponse]:
    return [ExperienceResponse.of(e) for e in await services.experiences.list()]


@admin.post("", status_code=status.HTTP_201_CREATED)
async def create_experience(body: ExperienceBody, services: ServicesDep) -> ExperienceResponse:
    return ExperienceResponse.of(await services.experiences.create(body.to_domain()))


@admin.put("/{experience_id}")
async def update_experience(
    experience_id: str, body: ExperienceBody, services: ServicesDep
) -> ExperienceResponse:
    return ExperienceResponse.of(await services.experiences.update(experience_id, body.to_domain()))


@admin.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(experience_id: str, services: ServicesDep) -> None:
    await services.experiences.delete(experience_id)
