from typing import Any

from fastapi.testclient import TestClient


def project(**overrides: Any) -> dict[str, Any]:
    return {
        "title": "Kross",
        "summary": {"en": "A web server", "fr": "Un serveur web"},
        "description": {"en": "Built on TCP sockets.", "fr": "Construit sur des sockets TCP."},
        "stack": ["Go"],
        "repo_url": "https://github.com/brandonkamga237/kross",
        "published": True,
        **overrides,
    }


def test_admin_creates_a_project_with_a_slug_derived_from_its_title(
    client: TestClient, admin: dict[str, str]
) -> None:
    response = client.post("/api/admin/projects", json=project(title="Gehmit Plateforme Été"), headers=admin)

    assert response.status_code == 201
    assert response.json()["slug"] == "gehmit-plateforme-ete"
    assert client.get("/api/projects/gehmit-plateforme-ete").status_code == 200


def test_visitors_only_see_published_projects(client: TestClient, admin: dict[str, str]) -> None:
    client.post("/api/admin/projects", json=project(title="Public"), headers=admin)
    client.post("/api/admin/projects", json=project(title="Draft", published=False), headers=admin)

    assert [p["title"] for p in client.get("/api/projects").json()] == ["Public"]
    assert client.get("/api/projects/draft").status_code == 404
    assert len(client.get("/api/admin/projects", headers=admin).json()) == 2


def test_projects_are_listed_by_position(client: TestClient, admin: dict[str, str]) -> None:
    client.post("/api/admin/projects", json=project(title="Second", position=2), headers=admin)
    client.post("/api/admin/projects", json=project(title="First", position=1), headers=admin)

    assert [p["title"] for p in client.get("/api/projects").json()] == ["First", "Second"]


def test_a_slug_cannot_be_used_twice(client: TestClient, admin: dict[str, str]) -> None:
    client.post("/api/admin/projects", json=project(), headers=admin)
    other = client.post("/api/admin/projects", json=project(title="Other"), headers=admin).json()

    duplicate = client.post("/api/admin/projects", json=project(), headers=admin)
    renamed = client.put(f"/api/admin/projects/{other['id']}", json=project(slug="kross"), headers=admin)

    assert duplicate.status_code == renamed.status_code == 409


def test_updating_a_project_keeps_its_slug_when_the_title_is_unchanged(
    client: TestClient, admin: dict[str, str]
) -> None:
    created = client.post("/api/admin/projects", json=project(), headers=admin).json()

    updated = client.put(
        f"/api/admin/projects/{created['id']}", json=project(stack=["Go", "TCP"]), headers=admin
    )

    assert updated.status_code == 200
    assert updated.json()["slug"] == "kross"
    assert updated.json()["stack"] == ["Go", "TCP"]


def test_deleting_an_unknown_project_is_a_404(client: TestClient, admin: dict[str, str]) -> None:
    assert client.delete("/api/admin/projects/unknown", headers=admin).status_code == 404


def test_invalid_payloads_are_rejected(client: TestClient, admin: dict[str, str]) -> None:
    bad_url = client.post("/api/admin/projects", json=project(repo_url="not a url"), headers=admin)
    unknown_field = client.post("/api/admin/projects", json=project(owner="me"), headers=admin)

    assert bad_url.status_code == unknown_field.status_code == 422
