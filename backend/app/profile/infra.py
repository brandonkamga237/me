from app.profile.domain import Profile, SocialLink
from app.shared.i18n import Localized
from app.shared.mongo import Database, Document

# The profile is a single document with a fixed id, so a save is always an upsert of the same one.
_ID = "profile"


class MongoProfileStore:
    def __init__(self, db: Database) -> None:
        self._collection = db["profile"]

    async def get(self) -> Profile | None:
        doc = await self._collection.find_one({"_id": _ID})
        return _from_doc(doc) if doc else None

    async def save(self, profile: Profile) -> None:
        await self._collection.replace_one({"_id": _ID}, _to_doc(profile), upsert=True)


def _to_doc(profile: Profile) -> Document:
    return {
        "name": profile.name,
        "headline": {"en": profile.headline.en, "fr": profile.headline.fr},
        "bio": {"en": profile.bio.en, "fr": profile.bio.fr},
        "location": profile.location,
        "email": profile.email,
        "available": profile.available,
        "resume_url": profile.resume_url,
        "socials": [{"label": s.label, "url": s.url} for s in profile.socials],
    }


def _from_doc(doc: Document) -> Profile:
    return Profile(
        name=doc["name"],
        headline=Localized(**doc["headline"]),
        bio=Localized(**doc["bio"]),
        location=doc["location"],
        email=doc["email"],
        available=doc["available"],
        resume_url=doc.get("resume_url"),
        socials=tuple(SocialLink(**s) for s in doc.get("socials", [])),
    )
