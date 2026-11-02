from typing import Any

from fastapi.testclient import TestClient

PROFILE: dict[str, Any] = {
    "name": "Brandon Kamga",
    "headline": {"en": "Software engineer", "fr": "Ingénieur logiciel"},
    "bio": {"en": "I build backends.", "fr": "Je construis des backends."},
    "location": "Yaoundé, Cameroon",
    "email": "hello@example.com",
    "available": True,
    "socials": [{"label": "GitHub", "url": "https://github.com/brandonkamga237"}],
}


def experience(**overrides: Any) -> dict[str, Any]:
    return {
        "company": "LesCracks",
        "role": {"en": "Founder", "fr": "Fondateur"},
        "location": "Yaoundé",
        "start": "2024-01-01",
        "description": {"en": "Built the platform.", "fr": "Construit la plateforme."},
        **overrides,
    }


def test_the_profile_is_missing_until_the_admin_sets_it(client: TestClient, admin: dict[str, str]) -> None:
    assert client.get("/api/profile").status_code == 404

    assert client.put("/api/admin/profile", json=PROFILE, headers=admin).status_code == 200
    assert client.get("/api/profile").json()["headline"]["fr"] == "Ingénieur logiciel"


def test_experiences_are_listed_most_recent_first(client: TestClient, admin: dict[str, str]) -> None:
    client.post("/api/admin/experiences", json=experience(company="Old", start="2020-01-01"), headers=admin)
    client.post("/api/admin/experiences", json=experience(company="New", start="2025-06-01"), headers=admin)

    assert [e["company"] for e in client.get("/api/experiences").json()] == ["New", "Old"]


def test_an_experience_cannot_end_before_it_starts(client: TestClient, admin: dict[str, str]) -> None:
    response = client.post("/api/admin/experiences", json=experience(end="2023-01-01"), headers=admin)

    assert response.status_code == 409


def test_skills_are_grouped_by_category_and_ordered(client: TestClient, admin: dict[str, str]) -> None:
    for name, position in (("Go", 1), ("Java", 0)):
        body = {"name": name, "category": "language", "icon": name.lower(), "position": position}
        client.post("/api/admin/skills", json=body, headers=admin)

    skills = client.get("/api/skills").json()

    assert [s["name"] for s in skills] == ["Java", "Go"]
    assert (
        client.post("/api/admin/skills", json={"name": "X", "category": "magic"}, headers=admin).status_code
        == 422
    )
