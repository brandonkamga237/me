from collections.abc import Iterator
from dataclasses import dataclass
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from app.auth.infra import Argon2Passwords
from app.config import Settings
from app.container import Services, auth_service
from app.experiences.application import ExperienceService
from app.main import create_app
from app.messages.application import MessageService
from app.profile.application import ProfileService
from app.projects.application import ProjectService
from app.shared.rate_limit import RateLimiter
from app.skills.application import SkillService
from tests.fakes import (
    InMemoryExperienceStore,
    InMemoryMessageStore,
    InMemoryProfileStore,
    InMemoryProjectStore,
    InMemorySkillStore,
)

ADMIN_EMAIL = "admin@test.dev"
ADMIN_PASSWORD = "correct horse battery staple"


@dataclass
class Stores:
    profile: InMemoryProfileStore
    projects: InMemoryProjectStore
    experiences: InMemoryExperienceStore
    skills: InMemorySkillStore
    messages: InMemoryMessageStore


@pytest.fixture(scope="session")
def settings() -> Settings:
    return Settings(
        environment="test",
        admin_email=ADMIN_EMAIL,
        admin_password_hash=Argon2Passwords().hash(ADMIN_PASSWORD),
        login_attempts_per_15_min=3,
        messages_per_hour=2,
    )


@pytest.fixture
def stores() -> Stores:
    return Stores(
        InMemoryProfileStore(),
        InMemoryProjectStore(),
        InMemoryExperienceStore(),
        InMemorySkillStore(),
        InMemoryMessageStore(),
    )


@pytest.fixture
def client(settings: Settings, stores: Stores) -> Iterator[TestClient]:
    services = Services(
        profile=ProfileService(stores.profile),
        projects=ProjectService(stores.projects),
        experiences=ExperienceService(stores.experiences),
        skills=SkillService(stores.skills),
        messages=MessageService(stores.messages, RateLimiter(settings.messages_per_hour, timedelta(hours=1))),
        auth=auth_service(settings),
    )
    with TestClient(create_app(settings, services)) as test_client:
        yield test_client


@pytest.fixture
def admin(client: TestClient) -> dict[str, str]:
    """Authorization headers for the signed-in admin."""
    response = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
