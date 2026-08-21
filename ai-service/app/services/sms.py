"""Farmer-facing SMS templates and formatting for Africa's Talking delivery.

Sending happens on the Go side (backend/internal/clients/africastalking.go);
this module owns the message content in English, Kiswahili, and Luo so every
recommendation action has a short, single-segment friendly translation.
"""

from typing import Literal

from app.models.request import RecommendationRequest
from app.models.response import RecommendationAction, RecommendationResponse

Language = Literal["en", "sw", "luo"]

SUPPORTED_LANGUAGES: tuple[Language, ...] = ("en", "sw", "luo")
DEFAULT_LANGUAGE: Language = "en"

SMS_TEMPLATES: dict[Language, dict[RecommendationAction, str]] = {
    "en": {
        RecommendationAction.WAIT: (
            "AMATSI: WAIT. Rain is expected soon ({rain}% chance). "
            "Hold off irrigation to save water."
        ),
        RecommendationAction.IRRIGATE: (
            "AMATSI: IRRIGATE. Soil is dry ({soil}%). "
            "Apply about {volume} L this week for your {crop}."
        ),
        RecommendationAction.MONITOR: (
            "AMATSI: MONITOR. Soil moisture is adequate ({soil}%). "
            "No irrigation needed right now."
        ),
        RecommendationAction.CONSERVE: (
            "AMATSI: CONSERVE. Tank water is low ({tank} L left). "
            "Avoid non-essential irrigation."
        ),
    },
    "sw": {
        RecommendationAction.WAIT: (
            "AMATSI: SUBIRI. Mvua inatarajiwa ({rain}%). "
            "Usimwagilie maji shamba kwa sasa."
        ),
        RecommendationAction.IRRIGATE: (
            "AMATSI: MWANYA MAJI. Udongo ni mkavu ({soil}%). "
            "Mwanya lita {volume} wiki hii kwa {crop} yako."
        ),
        RecommendationAction.MONITOR: (
            "AMATSI: FUATILIA. Unyevu wa udongo ni {soil}%. "
            "Hakuna haja ya kumwagilia maji kwa sasa."
        ),
        RecommendationAction.CONSERVE: (
            "AMATSI: HIFADHI MAJI. Maji ya tangi yamepungua ({tank} L zimebaki). "
            "Epuka kumwagilia bila sababu."
        ),
    },
    "luo": {
        RecommendationAction.WAIT: (
            "AMATSI: KOR. Koth nyalo chwe ({rain}%). "
            "Kik timo irigeshen koro mondo ited kaka."
        ),
        RecommendationAction.IRRIGATE: (
            "AMATSI: IRIGESHEN. Low e punda ({soil}%). "
            "Ket litro {volume} e weekni mar {crop} ni."
        ),
        RecommendationAction.MONITOR: (
            "AMATSI: WENJ. Pi e low omed maber ({soil}%). "
            "Ok kata irigeshen koro."
        ),
        RecommendationAction.CONSERVE: (
            "AMATSI: GOL PI. Pi e tangi ndalo ({tank} L okethi). "
            "Kik timo irigeshen ma ok otere."
        ),
    },
}


def _template(language: str | None, action: RecommendationAction) -> str:
    normalized = (language or DEFAULT_LANGUAGE).strip().lower()
    if normalized not in SUPPORTED_LANGUAGES:
        normalized = DEFAULT_LANGUAGE
    return SMS_TEMPLATES[normalized][action]


def format_recommendation_sms(
    request: RecommendationRequest,
    response: RecommendationResponse,
    language: Language = DEFAULT_LANGUAGE,
) -> str:
    """Render a localized SMS body for the recommendation outcome."""
    return _template(language, response.action).format(
        rain=f"{request.rainfall_probability:.0f}",
        soil=f"{request.soil_moisture:.0f}",
        tank=f"{request.tank_level:,.0f}",
        volume=f"{response.water_volume_liters:,.0f}",
        crop=request.crop_type,
    )
