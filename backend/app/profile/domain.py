from dataclasses import dataclass
from typing import Protocol

from app.shared.i18n import Localized


@dataclass(frozen=True, slots=True)
class SocialLink:
    label: str
    url: str


@dataclass(frozen=True, slots=True)
class Profile:
    name: str
    headline: Localized
    bio: Localized
    location: str
    email: str
    available: bool
    resume_url: str | None
    socials: tuple[SocialLink, ...]


class ProfileStore(Protocol):
    async def get(self) -> Profile | None: ...

    async def save(self, profile: Profile) -> None: ...
