from typing import Annotated, cast

from fastapi import Depends, Request

from app.container import Services


def services(request: Request) -> Services:
    return cast(Services, request.app.state.services)


ServicesDep = Annotated[Services, Depends(services)]
