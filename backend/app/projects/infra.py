from datetime import datetime

from pymongo import ASCENDING, DESCENDING, ReturnDocument
from pymongo.errors import DuplicateKeyError

from app.projects.domain import Project, ProjectFields
from app.shared.errors import ConflictError
from app.shared.i18n import Localized
from app.shared.mongo import Database, Document, object_id


class MongoProjectStore:
    def __init__(self, db: Database) -> None:
        self._collection = db["projects"]

    async def ensure_indexes(self) -> None:
        # The service checks slugs first; the index settles two saves racing for the same one.
        await self._collection.create_index("slug", unique=True)
        await self._collection.create_index([("published", ASCENDING), ("position", ASCENDING)])

    async def list(self, *, published_only: bool) -> list[Project]:
        query = {"published": True} if published_only else {}
        cursor = self._collection.find(query).sort([("position", ASCENDING), ("created_at", DESCENDING)])
        return [_from_doc(doc) async for doc in cursor]

    async def get(self, project_id: str) -> Project | None:
        oid = object_id(project_id)
        doc = await self._collection.find_one({"_id": oid}) if oid else None
        return _from_doc(doc) if doc else None

    async def get_by_slug(self, slug: str) -> Project | None:
        doc = await self._collection.find_one({"slug": slug})
        return _from_doc(doc) if doc else None

    async def add(self, fields: ProjectFields, now: datetime) -> Project:
        doc = {**_fields_doc(fields), "created_at": now, "updated_at": now}
        try:
            result = await self._collection.insert_one(doc)
        except DuplicateKeyError as error:
            raise ConflictError(f"Another project already uses the slug '{fields.slug}'") from error
        return _from_doc({**doc, "_id": result.inserted_id})

    async def replace(self, project_id: str, fields: ProjectFields, now: datetime) -> Project | None:
        oid = object_id(project_id)
        if oid is None:
            return None
        try:
            doc = await self._collection.find_one_and_update(
                {"_id": oid},
                {"$set": {**_fields_doc(fields), "updated_at": now}},
                return_document=ReturnDocument.AFTER,
            )
        except DuplicateKeyError as error:
            raise ConflictError(f"Another project already uses the slug '{fields.slug}'") from error
        return _from_doc(doc) if doc else None

    async def delete(self, project_id: str) -> bool:
        oid = object_id(project_id)
        return bool(oid) and (await self._collection.delete_one({"_id": oid})).deleted_count == 1


def _fields_doc(fields: ProjectFields) -> Document:
    return {
        "slug": fields.slug,
        "title": fields.title,
        "summary": {"en": fields.summary.en, "fr": fields.summary.fr},
        "description": {"en": fields.description.en, "fr": fields.description.fr},
        "stack": list(fields.stack),
        "repo_url": fields.repo_url,
        "live_url": fields.live_url,
        "cover_url": fields.cover_url,
        "featured": fields.featured,
        "published": fields.published,
        "position": fields.position,
    }


def _from_doc(doc: Document) -> Project:
    return Project(
        id=str(doc["_id"]),
        fields=ProjectFields(
            slug=doc["slug"],
            title=doc["title"],
            summary=Localized(**doc["summary"]),
            description=Localized(**doc["description"]),
            stack=tuple(doc["stack"]),
            repo_url=doc.get("repo_url"),
            live_url=doc.get("live_url"),
            cover_url=doc.get("cover_url"),
            featured=doc["featured"],
            published=doc["published"],
            position=doc["position"],
        ),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )
