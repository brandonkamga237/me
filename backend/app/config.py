from functools import lru_cache
from typing import Literal, Self

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Development defaults, so the API starts with no .env. Production refuses to boot with them.
_DEV_JWT_SECRET = "dev-only-secret-never-use-in-production-6f1c2a9d"  # noqa: S105
# Hash of "admin-dev-password".
_DEV_ADMIN_PASSWORD_HASH = (
    "$argon2id$v=19$m=65536,t=3,p=4$gXyo6h7NCmfN8ZIp8DK7Fg$OoOgXPzl+rvIfuOKqJc1SZjA9ocNrxTkG+3/9YYkykg"  # noqa: S105
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: Literal["dev", "test", "prod"] = "dev"
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "me"
    jwt_secret: SecretStr = SecretStr(_DEV_JWT_SECRET)
    jwt_ttl_minutes: int = 120
    admin_email: str = "admin@example.com"
    admin_password_hash: SecretStr = SecretStr(_DEV_ADMIN_PASSWORD_HASH)
    login_attempts_per_15_min: int = 10
    messages_per_hour: int = 5

    @model_validator(mode="after")
    def no_dev_secrets_in_production(self) -> Self:
        if self.environment == "prod":
            if self.jwt_secret.get_secret_value() == _DEV_JWT_SECRET or len(self.jwt_secret) < 32:
                raise ValueError("JWT_SECRET must be set to a random value of 32+ characters in production")
            if self.admin_password_hash.get_secret_value() == _DEV_ADMIN_PASSWORD_HASH:
                raise ValueError("ADMIN_PASSWORD_HASH must be set in production")
            if self.admin_email == "admin@example.com":
                raise ValueError("ADMIN_EMAIL must be set in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
