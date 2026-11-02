from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True, slots=True)
class AccessToken:
    value: str
    expires_at: datetime


@dataclass(frozen=True, slots=True)
class AdminSession:
    email: str
    expires_at: datetime


class TokenIssuer(Protocol):
    def issue(self, subject: str) -> AccessToken: ...

    def verify(self, token: str) -> AdminSession | None: ...


class PasswordVerifier(Protocol):
    def verify(self, password: str, password_hash: str) -> bool: ...
