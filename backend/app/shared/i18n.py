from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Localized:
    """Text shown to visitors, in each language the site is published in."""

    en: str
    fr: str
