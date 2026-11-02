import os
from collections.abc import AsyncIterator, Iterator
from datetime import UTC, datetime

import pytest
from pymongo import AsyncMongoClient
from testcontainers.community.mongodb import MongoDbContainer

from app.projects.domain import ProjectFields
from app.projects.infra import MongoProjectStore
from app.shared.errors import ConflictError
from app.shared.i18n import Localized
from app.shared.mongo import Database, Document

pytestmark = pytest.mark.integration

NOW = datetime(2026, 1, 1, tzinfo=UTC)


def fields(slug: str, position: int = 0, published: bool = True) -> ProjectFields:
    text = Localized(en="Text", fr="Texte")
    return ProjectFields(
        slug, slug.title(), text, text, ("Go",), None, None, None, False, published, position
    )


@pytest.fixture(scope="module")
def mongo_uri() -> Iterator[str]:
    """MONGO_URI when a server is already running (CI service), otherwise a throwaway container."""
    if uri := os.environ.get("MONGO_URI"):
        yield uri
        return
    with MongoDbContainer("mongo:8.0") as mongo:
        yield mongo.get_connection_url()


@pytest.fixture
async def db(mongo_uri: str) -> AsyncIterator[Database]:
    client: AsyncMongoClient[Document] = AsyncMongoClient(mongo_uri, tz_aware=True)
    yield client["test"]
    await client.drop_database("test")
    await client.close()


async def test_projects_round_trip_and_sort(db: Database) -> None:
    store = MongoProjectStore(db)
    await store.ensure_indexes()
    await store.add(fields("second", position=2), NOW)
    first = await store.add(fields("first", position=1), NOW)
    await store.add(fields("draft", published=False), NOW)

    assert [p.fields.slug for p in await store.list(published_only=True)] == ["first", "second"]
    assert await store.get(first.id) == first
    assert await store.get("not-an-id") is None


async def test_the_unique_index_turns_a_duplicate_slug_into_a_conflict(db: Database) -> None:
    store = MongoProjectStore(db)
    await store.ensure_indexes()
    await store.add(fields("kross"), NOW)

    with pytest.raises(ConflictError):
        await store.add(fields("kross"), NOW)
