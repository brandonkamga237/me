from datetime import datetime

from pymongo import DESCENDING, ReturnDocument

from app.messages.domain import Message
from app.shared.mongo import Database, Document, object_id


class MongoMessageStore:
    def __init__(self, db: Database) -> None:
        self._collection = db["messages"]

    async def ensure_indexes(self) -> None:
        await self._collection.create_index([("created_at", DESCENDING)])

    async def add(self, name: str, email: str, body: str, now: datetime) -> Message:
        doc = {"name": name, "email": email, "body": body, "created_at": now, "read": False}
        result = await self._collection.insert_one(doc)
        return _from_doc({**doc, "_id": result.inserted_id})

    async def list(self) -> list[Message]:
        return [_from_doc(doc) async for doc in self._collection.find().sort("created_at", DESCENDING)]

    async def set_read(self, message_id: str, read: bool) -> Message | None:
        oid = object_id(message_id)
        if oid is None:
            return None
        doc = await self._collection.find_one_and_update(
            {"_id": oid}, {"$set": {"read": read}}, return_document=ReturnDocument.AFTER
        )
        return _from_doc(doc) if doc else None

    async def delete(self, message_id: str) -> bool:
        oid = object_id(message_id)
        return bool(oid) and (await self._collection.delete_one({"_id": oid})).deleted_count == 1


def _from_doc(doc: Document) -> Message:
    return Message(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        body=doc["body"],
        created_at=doc["created_at"],
        read=doc["read"],
    )
