from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.shared.errors import (
    ConflictError,
    DomainError,
    NotFoundError,
    TooManyRequestsError,
    UnauthenticatedError,
)

_STATUS: dict[type[DomainError], int] = {
    NotFoundError: status.HTTP_404_NOT_FOUND,
    ConflictError: status.HTTP_409_CONFLICT,
    UnauthenticatedError: status.HTTP_401_UNAUTHORIZED,
    TooManyRequestsError: status.HTTP_429_TOO_MANY_REQUESTS,
}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def domain_error(_: Request, error: Exception) -> JSONResponse:
        if not isinstance(error, DomainError):
            raise error
        code = next(
            (s for kind, s in _STATUS.items() if isinstance(error, kind)), status.HTTP_400_BAD_REQUEST
        )
        headers = {"WWW-Authenticate": "Bearer"} if code == status.HTTP_401_UNAUTHORIZED else None
        return JSONResponse({"detail": error.message}, status_code=code, headers=headers)


def client_key(request: Request) -> str:
    """The visitor's address; uvicorn resolves it from X-Forwarded-For set by the trusted web app."""
    return request.client.host if request.client else "unknown"
