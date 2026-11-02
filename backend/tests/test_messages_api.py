from typing import Any

from fastapi.testclient import TestClient

from tests.conftest import Stores


def contact(**overrides: Any) -> dict[str, Any]:
    return {
        "name": "Ada",
        "email": "ada@example.com",
        "body": "I would like to talk about a role.",
        **overrides,
    }


def test_a_visitor_message_reaches_the_admin_unread(client: TestClient, admin: dict[str, str]) -> None:
    assert client.post("/api/messages", json=contact()).status_code == 202

    [message] = client.get("/api/admin/messages", headers=admin).json()
    assert message["read"] is False

    marked = client.patch(f"/api/admin/messages/{message['id']}", json={"read": True}, headers=admin)
    assert marked.json()["read"] is True


def test_a_filled_honeypot_is_accepted_but_not_stored(client: TestClient, stores: Stores) -> None:
    assert client.post("/api/messages", json=contact(website="spam.example")).status_code == 202
    assert stores.messages.items == {}


def test_senders_are_throttled(client: TestClient) -> None:
    statuses = [client.post("/api/messages", json=contact()).status_code for _ in range(3)]

    assert statuses == [202, 202, 429]


def test_short_messages_and_bad_emails_are_rejected(client: TestClient) -> None:
    assert client.post("/api/messages", json=contact(body="hi")).status_code == 422
    assert client.post("/api/messages", json=contact(email="nope")).status_code == 422
