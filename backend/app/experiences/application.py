from app.experiences.domain import Experience, ExperienceFields, ExperienceStore
from app.shared.errors import ConflictError, NotFoundError


class ExperienceService:
    def __init__(self, store: ExperienceStore) -> None:
        self._store = store

    async def list(self) -> list[Experience]:
        return await self._store.list()

    async def create(self, fields: ExperienceFields) -> Experience:
        _check_period(fields)
        return await self._store.add(fields)

    async def update(self, experience_id: str, fields: ExperienceFields) -> Experience:
        _check_period(fields)
        experience = await self._store.replace(experience_id, fields)
        if experience is None:
            raise NotFoundError("Experience not found")
        return experience

    async def delete(self, experience_id: str) -> None:
        if not await self._store.delete(experience_id):
            raise NotFoundError("Experience not found")


def _check_period(fields: ExperienceFields) -> None:
    if fields.end is not None and fields.end < fields.start:
        raise ConflictError("An experience cannot end before it starts")
