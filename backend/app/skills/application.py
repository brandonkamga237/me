from app.shared.errors import NotFoundError
from app.skills.domain import Skill, SkillFields, SkillStore


class SkillService:
    def __init__(self, store: SkillStore) -> None:
        self._store = store

    async def list(self) -> list[Skill]:
        return await self._store.list()

    async def create(self, fields: SkillFields) -> Skill:
        return await self._store.add(fields)

    async def update(self, skill_id: str, fields: SkillFields) -> Skill:
        skill = await self._store.replace(skill_id, fields)
        if skill is None:
            raise NotFoundError("Skill not found")
        return skill

    async def delete(self, skill_id: str) -> None:
        if not await self._store.delete(skill_id):
            raise NotFoundError("Skill not found")
