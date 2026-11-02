from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True, slots=True)
class Message:
    id: str
    name: str
    email: str
    body: str
    created_at: datetime
    read: bool


class MessageStore(Protocol):
    async def add(self, name: str, email: str, body: str, now: datetime) -> Message: ...

    async def list(self) -> list[Message]:
        """Newest first."""
        ...

    async def set_read(self, message_id: str, read: bool) -> Message | None: ...

    async def delete(self, message_id: str) -> bool: ...
