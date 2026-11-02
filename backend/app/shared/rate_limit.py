from collections import defaultdict, deque
from datetime import datetime, timedelta

from app.shared.clock import Clock, utc_now
from app.shared.errors import TooManyRequestsError


class RateLimiter:
    """Sliding window per key, in memory: the API runs as a single instance behind the web app."""

    def __init__(self, limit: int, window: timedelta, clock: Clock = utc_now) -> None:
        self._limit = limit
        self._window = window
        self._clock = clock
        self._hits: defaultdict[str, deque[datetime]] = defaultdict(deque)

    def hit(self, key: str) -> None:
        now = self._clock()
        hits = self._hits[key]
        while hits and now - hits[0] >= self._window:
            hits.popleft()
        if len(hits) >= self._limit:
            raise TooManyRequestsError("Too many attempts, try again later")
        hits.append(now)
