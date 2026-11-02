from app.profile.domain import Profile, ProfileStore
from app.shared.errors import NotFoundError


class ProfileService:
    def __init__(self, store: ProfileStore) -> None:
        self._store = store

    async def require(self) -> Profile:
        profile = await self._store.get()
        if profile is None:
            raise NotFoundError("The profile has not been set up yet")
        return profile

    async def update(self, profile: Profile) -> Profile:
        await self._store.save(profile)
        return profile
