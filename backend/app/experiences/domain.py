from dataclasses import dataclass
from datetime import date
from typing import Protocol

from app.shared.i18n import Localized


@dataclass(frozen=True, slots=True)
class ExperienceFields:
    company: str
    role: Localized
    location: str
    start: date
    end: date | None
    description: Localized
    url: str | None


@dataclass(frozen=True, slots=True)
class Experience:
    id: str
    fields: ExperienceFields


class ExperienceStore(Protocol):
    async def list(self) -> list[Experience]:
        """Most recent start first."""
        ...

    async def add(self, fields: ExperienceFields) -> Experience: ...

    async def replace(self, experience_id: str, fields: ExperienceFields) -> Experience | None: ...

    async def delete(self, experience_id: str) -> bool: ...
