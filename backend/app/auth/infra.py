from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.auth.domain import AccessToken, AdminSession
from app.shared.clock import Clock, utc_now

_ISSUER = "me-api"
_ALGORITHM = "HS256"


class JwtTokens:
    def __init__(self, secret: str, ttl: timedelta, clock: Clock = utc_now) -> None:
        self._secret = secret
        self._ttl = ttl
        self._clock = clock

    def issue(self, subject: str) -> AccessToken:
        now = self._clock()
        expires_at = now + self._ttl
        claims = {"sub": subject, "iss": _ISSUER, "iat": now, "exp": expires_at}
        return AccessToken(
            value=jwt.encode(claims, self._secret, algorithm=_ALGORITHM), expires_at=expires_at
        )

    def verify(self, token: str) -> AdminSession | None:
        try:
            claims = jwt.decode(
                token,
                self._secret,
                algorithms=[_ALGORITHM],
                issuer=_ISSUER,
                options={"require": ["sub", "exp", "iss"]},
            )
        except jwt.InvalidTokenError:
            return None
        return AdminSession(email=claims["sub"], expires_at=datetime.fromtimestamp(claims["exp"], UTC))


class Argon2Passwords:
    def __init__(self) -> None:
        self._hash = PasswordHash((Argon2Hasher(),))

    def verify(self, password: str, password_hash: str) -> bool:
        return self._hash.verify(password, password_hash)

    def hash(self, password: str) -> str:
        return self._hash.hash(password)
