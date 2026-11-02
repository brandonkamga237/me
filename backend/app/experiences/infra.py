from datetime import date

from pymongo import DESCENDING, ReturnDocument

from app.experiences.domain import Experience, ExperienceFields
from app.shared.i18n import Localized
from app.shared.mongo import Database, Document, object_id


class MongoExperienceStore:
    def __init__(self, db: Database) -> None:
        self._collection = db["experiences"]

    async def ensure_indexes(self) -> None:
        await self._collection.create_index([("start", DESCENDING)])

    async def list(self) -> list[Experience]:
        return [_from_doc(doc) async for doc in self._collection.find().sort("start", DESCENDING)]

    async def add(self, fields: ExperienceFields) -> Experience:
        doc = _fields_doc(fields)
        result = await self._collection.insert_one(doc)
        return _from_doc({**doc, "_id": result.inserted_id})

    async def replace(self, experience_id: str, fields: ExperienceFields) -> Experience | None:
        oid = object_id(experience_id)
        if oid is None:
            return None
        doc = await self._collection.find_one_and_update(
            {"_id": oid}, {"$set": _fields_doc(fields)}, return_document=ReturnDocument.AFTER
        )
        return _from_doc(doc) if doc else None

    async def delete(self, experience_id: str) -> bool:
        oid = object_id(experience_id)
        return bool(oid) and (await self._collection.delete_one({"_id": oid})).deleted_count == 1


# BSON has no date type; ISO strings keep the day without a time zone and still sort correctly.
def _fields_doc(fields: ExperienceFields) -> Document:
    return {
        "company": fields.company,
        "role": {"en": fields.role.en, "fr": fields.role.fr},
        "location": fields.location,
        "start": fields.start.isoformat(),
        "end": fields.end.isoformat() if fields.end else None,
        "description": {"en": fields.description.en, "fr": fields.description.fr},
        "url": fields.url,
    }


def _from_doc(doc: Document) -> Experience:
    return Experience(
        id=str(doc["_id"]),
        fields=ExperienceFields(
            company=doc["company"],
            role=Localized(**doc["role"]),
            location=doc["location"],
            start=date.fromisoformat(doc["start"]),
            end=date.fromisoformat(doc["end"]) if doc.get("end") else None,
            description=Localized(**doc["description"]),
            url=doc.get("url"),
        ),
    )
