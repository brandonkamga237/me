from dataclasses import dataclass
from datetime import timedelta

from app.auth.application import AuthService
from app.auth.infra import Argon2Passwords, JwtTokens
from app.config import Settings
from app.experiences.application import ExperienceService
from app.experiences.infra import MongoExperienceStore
from app.messages.application import MessageService
from app.messages.infra import MongoMessageStore
from app.profile.application import ProfileService
from app.profile.infra import MongoProfileStore
from app.projects.application import ProjectService
from app.projects.infra import MongoProjectStore
from app.shared.mongo import Database
from app.shared.rate_limit import RateLimiter
from app.skills.application import SkillService
from app.skills.infra import MongoSkillStore


@dataclass(frozen=True, slots=True)
class Services:
    profile: ProfileService
    projects: ProjectService
    experiences: ExperienceService
    skills: SkillService
    messages: MessageService
    auth: AuthService


def auth_service(settings: Settings) -> AuthService:
    return AuthService(
        admin_email=settings.admin_email,
        admin_password_hash=settings.admin_password_hash.get_secret_value(),
        passwords=Argon2Passwords(),
        tokens=JwtTokens(settings.jwt_secret.get_secret_value(), timedelta(minutes=settings.jwt_ttl_minutes)),
        limiter=RateLimiter(settings.login_attempts_per_15_min, timedelta(minutes=15)),
    )


async def mongo_services(db: Database, settings: Settings) -> Services:
    projects = MongoProjectStore(db)
    experiences = MongoExperienceStore(db)
    skills = MongoSkillStore(db)
    messages = MongoMessageStore(db)
    for store in (projects, experiences, skills, messages):
        await store.ensure_indexes()
    return Services(
        profile=ProfileService(MongoProfileStore(db)),
        projects=ProjectService(projects),
        experiences=ExperienceService(experiences),
        skills=SkillService(skills),
        messages=MessageService(messages, RateLimiter(settings.messages_per_hour, timedelta(hours=1))),
        auth=auth_service(settings),
    )
