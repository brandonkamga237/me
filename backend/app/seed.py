"""Fills an empty database with starting content: python -m app.seed

Collections that already hold data are left untouched, so running it twice changes nothing.
"""

import asyncio

from pymongo import AsyncMongoClient

from app.config import get_settings
from app.container import Services, mongo_services
from app.profile.domain import Profile, SocialLink
from app.projects.application import ProjectDraft
from app.projects.domain import ProjectFields
from app.shared.i18n import Localized
from app.shared.mongo import Document
from app.skills.domain import SkillCategory, SkillFields

PROFILE = Profile(
    name="Brandon Kamga",
    headline=Localized(
        en="Software engineer: backend, platform & DevOps",
        fr="Ingénieur logiciel : backend, plateforme et DevOps",
    ),
    bio=Localized(
        en=(
            "I build backend systems and the platforms around them: domain modelling, APIs, background "
            "jobs, auth, storage, containers and delivery. I'm also the founder of LesCracks, a platform "
            "where I share what I know, train young people and push them to innovate."
        ),
        fr=(
            "Je construis des systèmes backend et les plateformes qui les entourent : modélisation métier, "
            "API, tâches de fond, authentification, stockage, conteneurs et livraison. Je suis aussi le "
            "fondateur de LesCracks, une plateforme où je partage ce que je sais, je forme les jeunes et "
            "je les pousse à innover."
        ),
    ),
    location="Yaoundé, Cameroon",
    # Set the real address from the admin: it is shown on the public site.
    email="hello@example.com",
    available=True,
    resume_url=None,
    socials=(
        SocialLink("GitHub", "https://github.com/brandonkamga237"),
        SocialLink("LinkedIn", "https://www.linkedin.com/in/brandon-kamga-b9a55b436/"),
        SocialLink("LesCracks", "https://lescracks.com"),
        SocialLink("WhatsApp", "https://whatsapp.com/channel/0029VbAyFN21HsprPN1amr2a"),
    ),
)

SKILLS: list[tuple[SkillCategory, list[tuple[str, str | None]]]] = [
    (
        SkillCategory.LANGUAGE,
        [
            ("Java", "openjdk"),
            ("Go", "go"),
            ("TypeScript", "typescript"),
            ("Python", "python"),
            ("JavaScript", "javascript"),
        ],
    ),
    (
        SkillCategory.BACKEND,
        [
            ("Spring Boot", "springboot"),
            ("FastAPI", "fastapi"),
            ("Hibernate", "hibernate"),
            ("Flyway", "flyway"),
            ("Keycloak", "keycloak"),
        ],
    ),
    (
        SkillCategory.FRONTEND,
        [("React", "react"), ("Next.js", "nextdotjs"), ("Vite", "vite"), ("Tailwind CSS", "tailwindcss")],
    ),
    (SkillCategory.DATA, [("PostgreSQL", "postgresql"), ("MongoDB", "mongodb"), ("MinIO", "minio")]),
    (
        SkillCategory.PLATFORM,
        [("Docker", "docker"), ("Linux", "linux"), ("GitHub Actions", "githubactions"), ("Git", "git")],
    ),
    (
        SkillCategory.PRACTICE,
        [("Hexagonal architecture", None), ("DDD", None), ("REST", None), ("OAuth2", None)],
    ),
]


def _project(
    position: int,
    title: str,
    summary: tuple[str, str],
    description: tuple[str, str],
    stack: list[str],
    repo: str,
    live: str | None = None,
    featured: bool = False,
) -> ProjectDraft:
    return ProjectDraft(
        fields=ProjectFields(
            slug="",
            title=title,
            summary=Localized(*summary),
            description=Localized(*description),
            stack=tuple(stack),
            repo_url=f"https://github.com/brandonkamga237/{repo}",
            live_url=live,
            cover_url=None,
            featured=featured,
            published=True,
            position=position,
        ),
        slug_given=False,
    )


PROJECTS = [
    _project(
        0,
        "LesCracks",
        ("The platform behind lescracks.com.", "La plateforme derrière lescracks.com."),
        (
            "A tech blog, events and hackathons, the LesCracks Talk, member profiles with badges and "
            "certificates, and a newsletter. In production, shipped through versioned releases.",
            "Blog tech, événements et hackathons, LesCracks Talk, profils membres avec badges et "
            "certificats, newsletter. En production, livrée par versions successives.",
        ),
        ["Java 21", "Spring Boot", "React", "TypeScript", "PostgreSQL", "MinIO"],
        "lescracks-platform",
        "https://lescracks.com",
        featured=True,
    ),
    _project(
        1,
        "SourceFolio",
        (
            "Developer portfolios you can read the code of.",
            "Des portfolios de développeurs dont le code est lisible.",
        ),
        (
            "A catalogue of developer portfolios whose source is public. Authors publish in one click with "
            "GitHub sign-in and get feedback, private analytics and a health report of their site.",
            "Un catalogue de portfolios de développeurs au code source public. Les auteurs publient en un clic "
            "via GitHub et reçoivent des retours, des statistiques privées et un rapport de santé de leur site.",
        ),
        ["Java 21", "Spring Boot 4", "Next.js", "PostgreSQL", "JobRunr", "Playwright"],
        "sourcefolio",
        featured=True,
    ),
    _project(
        2,
        "Kross",
        ("A web server in Go, from TCP sockets up.", "Un serveur web en Go, à partir des sockets TCP."),
        (
            "A lightweight web server written directly on top of TCP sockets, to understand HTTP from the "
            "bytes up. Tested under the race detector.",
            "Un serveur web léger écrit directement sur des sockets TCP, pour comprendre HTTP octet par octet. "
            "Testé avec le détecteur de race conditions.",
        ),
        ["Go", "TCP", "HTTP/1.1"],
        "kross",
        featured=True,
    ),
    _project(
        3,
        "Gehmit platform",
        ("Website and back office for a non-profit.", "Site et back-office d'une association."),
        (
            "Public website and admin back office for Gehmit, a Cameroonian non-profit that trains young "
            "people for careers in tech. Hexagonal, domain-driven backend with Keycloak single sign-on.",
            "Site public et back-office de Gehmit, association camerounaise qui forme les jeunes aux métiers "
            "du numérique. Backend hexagonal orienté domaine, authentification unique avec Keycloak.",
        ),
        ["Spring Boot", "DDD", "Keycloak", "React 19", "PostgreSQL"],
        "gehmit-platform",
        "https://gehmit.org",
    ),
]


async def seed(services: Services, db_has: dict[str, bool]) -> list[str]:
    done = []
    if not db_has["profile"]:
        await services.profile.update(PROFILE)
        done.append("profile")
    if not db_has["skills"]:
        for category, skills in SKILLS:
            for position, (name, icon) in enumerate(skills):
                await services.skills.create(SkillFields(name, category, icon, position))
        done.append("skills")
    if not db_has["projects"]:
        for draft in PROJECTS:
            await services.projects.create(draft)
        done.append("projects")
    return done


async def main() -> None:
    settings = get_settings()
    client: AsyncMongoClient[Document] = AsyncMongoClient(settings.mongo_uri, tz_aware=True)
    try:
        db = client[settings.mongo_db]
        services = await mongo_services(db, settings)
        has = {
            name: await db[name].estimated_document_count() > 0 for name in ("profile", "skills", "projects")
        }
        done = await seed(services, has)
        print(f"Seeded: {', '.join(done)}" if done else "Nothing to seed: the database already has content.")
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
