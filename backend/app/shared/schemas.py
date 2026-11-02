from typing import Annotated, Self

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.shared.i18n import Localized

ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
LongText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=8000)]


class Schema(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class LocalizedShort(Schema):
    en: ShortText
    fr: ShortText

    def to_domain(self) -> Localized:
        return Localized(en=self.en, fr=self.fr)

    @classmethod
    def of(cls, text: Localized) -> Self:
        return cls(en=text.en, fr=text.fr)


class LocalizedLong(Schema):
    en: LongText
    fr: LongText

    def to_domain(self) -> Localized:
        return Localized(en=self.en, fr=self.fr)

    @classmethod
    def of(cls, text: Localized) -> Self:
        return cls(en=text.en, fr=text.fr)
