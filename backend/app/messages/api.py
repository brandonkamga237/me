from datetime import datetime
from typing import Annotated, Self

from fastapi import APIRouter, Depends, Request, Response, status
from pydantic import EmailStr, StringConstraints

from app.auth.api import require_admin
from app.dependencies import ServicesDep
from app.messages.domain import Message
from app.shared.http import client_key
from app.shared.schemas import Schema, ShortText

MessageText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=10, max_length=4000)]


class ContactBody(Schema):
    name: ShortText
    email: EmailStr
    body: MessageText
    website: str = ""
    """Hidden from people by the form: only bots fill it in."""


class ReadBody(Schema):
    read: bool


class MessageResponse(Schema):
    id: str
    name: str
    email: str
    body: str
    created_at: datetime
    read: bool

    @classmethod
    def of(cls, message: Message) -> Self:
        return cls(
            id=message.id,
            name=message.name,
            email=message.email,
            body=message.body,
            created_at=message.created_at,
            read=message.read,
        )


public = APIRouter(prefix="/api/messages", tags=["messages"])
admin = APIRouter(prefix="/api/admin/messages", tags=["messages"], dependencies=[Depends(require_admin)])


@public.post("", status_code=status.HTTP_202_ACCEPTED, response_class=Response)
async def send_message(body: ContactBody, request: Request, services: ServicesDep) -> None:
    # A bot gets the same answer as a person, so it has nothing to learn from.
    if body.website:
        return
    await services.messages.submit(body.name, str(body.email), body.body, client_key(request))


@admin.get("")
async def list_messages(services: ServicesDep) -> list[MessageResponse]:
    return [MessageResponse.of(m) for m in await services.messages.list()]


@admin.patch("/{message_id}")
async def mark_message(message_id: str, body: ReadBody, services: ServicesDep) -> MessageResponse:
    return MessageResponse.of(await services.messages.mark(message_id, body.read))


@admin.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: str, services: ServicesDep) -> None:
    await services.messages.delete(message_id)
