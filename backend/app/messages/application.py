from app.messages.domain import Message, MessageStore
from app.shared.clock import Clock, utc_now
from app.shared.errors import NotFoundError
from app.shared.rate_limit import RateLimiter


class MessageService:
    def __init__(self, store: MessageStore, limiter: RateLimiter, clock: Clock = utc_now) -> None:
        self._store = store
        self._limiter = limiter
        self._clock = clock

    async def submit(self, name: str, email: str, body: str, sender: str) -> Message:
        self._limiter.hit(sender)
        return await self._store.add(name, email, body, self._clock())

    async def list(self) -> list[Message]:
        return await self._store.list()

    async def mark(self, message_id: str, read: bool) -> Message:
        message = await self._store.set_read(message_id, read)
        if message is None:
            raise NotFoundError("Message not found")
        return message

    async def delete(self, message_id: str) -> None:
        if not await self._store.delete(message_id):
            raise NotFoundError("Message not found")
