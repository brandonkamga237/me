from dataclasses import dataclass
from enum import StrEnum
from typing import Protocol


class SkillCategory(StrEnum):
    LANGUAGE = "language"
    BACKEND = "backend"
    FRONTEND = "frontend"
    DATA = "data"
    PLATFORM = "platform"
    PRACTICE = "practice"


@dataclass(frozen=True, slots=True)
class SkillFields:
    name: str
    category: SkillCategory
    icon: str | None
    """A Simple Icons slug, so the site can show the brand's own logo."""
    position: int


@dataclass(frozen=True, slots=True)
class Skill:
    id: str
    fields: SkillFields


class SkillStore(Protocol):
    async def list(self) -> list[Skill]:
        """Ordered by position, then name."""
        ...

    async def add(self, fields: SkillFields) -> Skill: ...

    async def replace(self, skill_id: str, fields: SkillFields) -> Skill | None: ...

    async def delete(self, skill_id: str) -> bool: ...
