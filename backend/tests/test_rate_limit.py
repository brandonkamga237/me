from datetime import UTC, datetime, timedelta

import pytest

from app.shared.errors import TooManyRequestsError
from app.shared.rate_limit import RateLimiter


def test_the_window_slides() -> None:
    now = datetime(2026, 1, 1, tzinfo=UTC)
    limiter = RateLimiter(2, timedelta(minutes=1), clock=lambda: now)

    limiter.hit("a")
    limiter.hit("a")
    with pytest.raises(TooManyRequestsError):
        limiter.hit("a")
    limiter.hit("b")

    now += timedelta(minutes=1)
    limiter.hit("a")
