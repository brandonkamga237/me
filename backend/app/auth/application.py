import hmac

from app.auth.domain import AccessToken, AdminSession, PasswordVerifier, TokenIssuer
from app.shared.errors import UnauthenticatedError
from app.shared.rate_limit import RateLimiter


class AuthService:
    """A single admin, whose credentials come from configuration: there is no account to manage."""

    def __init__(
        self,
        admin_email: str,
        admin_password_hash: str,
        passwords: PasswordVerifier,
        tokens: TokenIssuer,
        limiter: RateLimiter,
    ) -> None:
        self._admin_email = admin_email.lower()
        self._admin_password_hash = admin_password_hash
        self._passwords = passwords
        self._tokens = tokens
        self._limiter = limiter

    def login(self, email: str, password: str, sender: str) -> AccessToken:
        self._limiter.hit(sender)
        # Both checks always run, so the response time does not tell whether the email was right.
        email_ok = hmac.compare_digest(email.lower().encode(), self._admin_email.encode())
        password_ok = self._passwords.verify(password, self._admin_password_hash)
        if not (email_ok and password_ok):
            raise UnauthenticatedError("Invalid email or password")
        return self._tokens.issue(self._admin_email)

    def authenticate(self, token: str) -> AdminSession:
        session = self._tokens.verify(token)
        if session is None or session.email != self._admin_email:
            raise UnauthenticatedError("Session expired, sign in again")
        return session
