from typing import Annotated, Self

from fastapi import APIRouter, Depends
from pydantic import EmailStr, Field, HttpUrl

from app.auth.api import require_admin
from app.dependencies import ServicesDep
from app.profile.domain import Profile, SocialLink
from app.shared.schemas import LocalizedLong, LocalizedShort, Schema, ShortText


class SocialLinkBody(Schema):
    label: ShortText
    url: HttpUrl


class ProfileBody(Schema):
    name: ShortText
    headline: LocalizedShort
    bio: LocalizedLong
    location: ShortText
    email: EmailStr
    available: bool
    resume_url: HttpUrl | None = None
    socials: Annotated[list[SocialLinkBody], Field(default_factory=list, max_length=12)]

    def to_domain(self) -> Profile:
        return Profile(
            name=self.name,
            headline=self.headline.to_domain(),
            bio=self.bio.to_domain(),
            location=self.location,
            email=str(self.email),
            available=self.available,
            resume_url=str(self.resume_url) if self.resume_url else None,
            socials=tuple(SocialLink(label=s.label, url=str(s.url)) for s in self.socials),
        )


class SocialLinkResponse(Schema):
    label: str
    url: str


class ProfileResponse(Schema):
    name: str
    headline: LocalizedShort
    bio: LocalizedLong
    location: str
    email: str
    available: bool
    resume_url: str | None
    socials: list[SocialLinkResponse]

    @classmethod
    def of(cls, profile: Profile) -> Self:
        return cls(
            name=profile.name,
            headline=LocalizedShort.of(profile.headline),
            bio=LocalizedLong.of(profile.bio),
            location=profile.location,
            email=profile.email,
            available=profile.available,
            resume_url=profile.resume_url,
            socials=[SocialLinkResponse(label=s.label, url=s.url) for s in profile.socials],
        )


public = APIRouter(prefix="/api/profile", tags=["profile"])
admin = APIRouter(prefix="/api/admin/profile", tags=["profile"], dependencies=[Depends(require_admin)])


@public.get("")
async def get_profile(services: ServicesDep) -> ProfileResponse:
    return ProfileResponse.of(await services.profile.require())


@admin.put("")
async def update_profile(body: ProfileBody, services: ServicesDep) -> ProfileResponse:
    return ProfileResponse.of(await services.profile.update(body.to_domain()))
