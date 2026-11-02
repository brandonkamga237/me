from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import EmailStr, StringConstraints

from app.auth.domain import AdminSession
from app.dependencies import ServicesDep
from app.shared.errors import UnauthenticatedError
from app.shared.http import client_key
from app.shared.schemas import Schema

_bearer = HTTPBearer(auto_error=False)


def require_admin(
    services: ServicesDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> AdminSession:
    if credentials is None:
        raise UnauthenticatedError("Sign in to continue")
    return services.auth.authenticate(credentials.credentials)


class LoginBody(Schema):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=1, max_length=256)]


class TokenResponse(Schema):
    access_token: str
    token_type: str = "bearer"  # noqa: S105 - the OAuth2 token type, not a secret
    expires_at: datetime


class SessionResponse(Schema):
    email: str
    expires_at: datetime


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
def login(body: LoginBody, request: Request, services: ServicesDep) -> TokenResponse:
    token = services.auth.login(str(body.email), body.password, client_key(request))
    return TokenResponse(access_token=token.value, expires_at=token.expires_at)


@router.get("/me")
def me(session: Annotated[AdminSession, Depends(require_admin)]) -> SessionResponse:
    return SessionResponse(email=session.email, expires_at=session.expires_at)
