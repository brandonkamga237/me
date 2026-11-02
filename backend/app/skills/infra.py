from pymongo import ASCENDING, ReturnDocument

from app.shared.mongo import Database, Document, object_id
from app.skills.domain import Skill, SkillCategory, SkillFields


class MongoSkillStore:
    def __init__(self, db: Database) -> None:
        self._collection = db["skills"]

    async def ensure_indexes(self) -> None:
        await self._collection.create_index([("position", ASCENDING), ("name", ASCENDING)])

    async def list(self) -> list[Skill]:
        cursor = self._collection.find().sort([("position", ASCENDING), ("name", ASCENDING)])
        return [_from_doc(doc) async for doc in cursor]

    async def add(self, fields: SkillFields) -> Skill:
        doc = _fields_doc(fields)
        result = await self._collection.insert_one(doc)
        return _from_doc({**doc, "_id": result.inserted_id})

    async def replace(self, skill_id: str, fields: SkillFields) -> Skill | None:
        oid = object_id(skill_id)
        if oid is None:
            return None
        doc = await self._collection.find_one_and_update(
            {"_id": oid}, {"$set": _fields_doc(fields)}, return_document=ReturnDocument.AFTER
        )
        return _from_doc(doc) if doc else None

    async def delete(self, skill_id: str) -> bool:
        oid = object_id(skill_id)
        return bool(oid) and (await self._collection.delete_one({"_id": oid})).deleted_count == 1


def _fields_doc(fields: SkillFields) -> Document:
    return {
        "name": fields.name,
        "category": fields.category.value,
        "icon": fields.icon,
        "position": fields.position,
    }


def _from_doc(doc: Document) -> Skill:
    return Skill(
        id=str(doc["_id"]),
        fields=SkillFields(
            name=doc["name"],
            category=SkillCategory(doc["category"]),
            icon=doc.get("icon"),
            position=doc["position"],
        ),
    )
