"""In-memory stores that copy what they keep, so a test sees only what a real store would return."""

from dataclasses import replace
from datetime import datetime
from itertools import count

from app.experiences.domain import Experience, ExperienceFields
from app.messages.domain import Message
from app.profile.domain import Profile
from app.projects.domain import Project, ProjectFields
from app.skills.domain import Skill, SkillFields

_ids = count(1)


def _next_id() -> str:
    return f"{next(_ids):024x}"


class InMemoryProfileStore:
    def __init__(self) -> None:
        self.profile: Profile | None = None

    async def get(self) -> Profile | None:
        return self.profile

    async def save(self, profile: Profile) -> None:
        self.profile = profile


class InMemoryProjectStore:
    def __init__(self) -> None:
        self.items: dict[str, Project] = {}

    async def list(self, *, published_only: bool) -> list[Project]:
        items = [p for p in self.items.values() if p.fields.published or not published_only]
        items.sort(key=lambda p: p.created_at, reverse=True)
        return sorted(items, key=lambda p: p.fields.position)

    async def get(self, project_id: str) -> Project | None:
        return self.items.get(project_id)

    async def get_by_slug(self, slug: str) -> Project | None:
        return next((p for p in self.items.values() if p.fields.slug == slug), None)

    async def add(self, fields: ProjectFields, now: datetime) -> Project:
        project = Project(id=_next_id(), fields=fields, created_at=now, updated_at=now)
        self.items[project.id] = project
        return project

    async def replace(self, project_id: str, fields: ProjectFields, now: datetime) -> Project | None:
        if project_id not in self.items:
            return None
        self.items[project_id] = replace(self.items[project_id], fields=fields, updated_at=now)
        return self.items[project_id]

    async def delete(self, project_id: str) -> bool:
        return self.items.pop(project_id, None) is not None


class InMemoryExperienceStore:
    def __init__(self) -> None:
        self.items: dict[str, Experience] = {}

    async def list(self) -> list[Experience]:
        return sorted(self.items.values(), key=lambda e: e.fields.start, reverse=True)

    async def add(self, fields: ExperienceFields) -> Experience:
        experience = Experience(id=_next_id(), fields=fields)
        self.items[experience.id] = experience
        return experience

    async def replace(self, experience_id: str, fields: ExperienceFields) -> Experience | None:
        if experience_id not in self.items:
            return None
        self.items[experience_id] = Experience(id=experience_id, fields=fields)
        return self.items[experience_id]

    async def delete(self, experience_id: str) -> bool:
        return self.items.pop(experience_id, None) is not None


class InMemorySkillStore:
    def __init__(self) -> None:
        self.items: dict[str, Skill] = {}

    async def list(self) -> list[Skill]:
        return sorted(self.items.values(), key=lambda s: (s.fields.position, s.fields.name))

    async def add(self, fields: SkillFields) -> Skill:
        skill = Skill(id=_next_id(), fields=fields)
        self.items[skill.id] = skill
        return skill

    async def replace(self, skill_id: str, fields: SkillFields) -> Skill | None:
        if skill_id not in self.items:
            return None
        self.items[skill_id] = Skill(id=skill_id, fields=fields)
        return self.items[skill_id]

    async def delete(self, skill_id: str) -> bool:
        return self.items.pop(skill_id, None) is not None


class InMemoryMessageStore:
    def __init__(self) -> None:
        self.items: dict[str, Message] = {}

    async def add(self, name: str, email: str, body: str, now: datetime) -> Message:
        message = Message(id=_next_id(), name=name, email=email, body=body, created_at=now, read=False)
        self.items[message.id] = message
        return message

    async def list(self) -> list[Message]:
        return sorted(self.items.values(), key=lambda m: m.created_at, reverse=True)

    async def set_read(self, message_id: str, read: bool) -> Message | None:
        if message_id not in self.items:
            return None
        self.items[message_id] = replace(self.items[message_id], read=read)
        return self.items[message_id]

    async def delete(self, message_id: str) -> bool:
        return self.items.pop(message_id, None) is not None
