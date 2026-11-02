from fastapi.testclient import TestClient

from tests.conftest import ADMIN_EMAIL, ADMIN_PASSWORD


def test_login_returns_a_token_that_opens_admin_routes(client: TestClient) -> None:
    response = client.post("/api/auth/login", json={"email": ADMIN_EMAIL.upper(), "password": ADMIN_PASSWORD})

    assert response.status_code == 200
    token = response.json()["access_token"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.json()["email"] == ADMIN_EMAIL


def test_wrong_password_and_wrong_email_get_the_same_answer(client: TestClient) -> None:
    wrong_password = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": "nope"})
    wrong_email = client.post("/api/auth/login", json={"email": "x@test.dev", "password": ADMIN_PASSWORD})

    assert wrong_password.status_code == wrong_email.status_code == 401
    assert wrong_password.json() == wrong_email.json()


def test_login_is_throttled_after_repeated_attempts(client: TestClient) -> None:
    statuses = [
        client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": "nope"}).status_code
        for _ in range(4)
    ]

    assert statuses == [401, 401, 401, 429]


def test_admin_routes_reject_missing_and_forged_tokens(client: TestClient) -> None:
    assert client.get("/api/admin/projects").status_code == 401
    forged = client.get("/api/admin/projects", headers={"Authorization": "Bearer not.a.token"})
    assert forged.status_code == 401
    assert forged.headers["www-authenticate"] == "Bearer"
