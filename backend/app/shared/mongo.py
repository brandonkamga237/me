from typing import Any

from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

type Document = dict[str, Any]
type Database = AsyncDatabase[Document]


def object_id(value: str) -> ObjectId | None:
    """Unknown or malformed ids read as missing rather than as a server error."""
    return ObjectId(value) if ObjectId.is_valid(value) else None
