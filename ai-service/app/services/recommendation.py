"""Pure, explainable irrigation recommendation rules.

The order intentionally follows README section 6.2. The first matching rule
wins: rain, dry soil, adequately moist soil, low tank level, then
over-saturated soil. Keeping this module free of I/O makes every decision
repeatable and easy to test.
"""

from datetime import UTC, datetime

from app.models.request import RecommendationRequest
from app.models.response import RecommendationAction, RecommendationResponse


CROP_WATER_NEEDS_LITERS_PER_M2_WEEK = {
    "maize": 30.0,
    "beans": 20.0,
    "tomatoes": 35.0,
    "rice": 40.0,
}
DEFAULT_WATER_NEED_LITERS_PER_M2_WEEK = 25.0


def calculate_water_needed(crop_type: str, field_size_square_m: float) -> float:
    """Return the estimated weekly irrigation requirement in litres."""
    need_per_square_metre = CROP_WATER_NEEDS_LITERS_PER_M2_WEEK.get(
        crop_type.strip().lower(), DEFAULT_WATER_NEED_LITERS_PER_M2_WEEK
    )
    return round(need_per_square_metre * field_size_square_m, 2)


def _confidence(request: RecommendationRequest) -> str:
    supplied = request.model_fields_set
    if {"rainfall_probability", "soil_moisture", "tank_level"}.issubset(supplied):
        return "High"
    if {"rainfall_probability", "soil_moisture"}.issubset(supplied):
        return "Medium"
    return "Low"


def _response(
    action: RecommendationAction,
    reason: str,
    request: RecommendationRequest,
    *,
    water_saved_estimate: float = 0.0,
    water_volume_liters: float = 0.0,
) -> RecommendationResponse:
    return RecommendationResponse(
        action=action,
        reason=reason,
        water_saved_estimate=round(water_saved_estimate, 2),
        water_volume_liters=round(water_volume_liters, 2),
        confidence=_confidence(request),
        generated_at=datetime.now(UTC),
    )


def generate_recommendation(request: RecommendationRequest) -> RecommendationResponse:
    """Apply the documented rules and return one clear farmer action."""
    weekly_water_need = calculate_water_needed(request.crop_type, request.field_size_square_m)

    if request.rainfall_probability > 60:
        return _response(
            RecommendationAction.WAIT,
            f"There is a {request.rainfall_probability:.0f}% chance of rain. Wait before irrigating to use the expected rainfall.",
            request,
            water_saved_estimate=weekly_water_need,
        )

    if request.soil_moisture < 30:
        return _response(
            RecommendationAction.IRRIGATE,
            f"Soil moisture is low at {request.soil_moisture:.0f}%. Irrigate about {weekly_water_need:,.0f} L this week for your {request.crop_type} crop.",
            request,
            water_volume_liters=weekly_water_need,
        )

    if request.soil_moisture <= 60:
        return _response(
            RecommendationAction.MONITOR,
            f"Soil moisture is {request.soil_moisture:.0f}%, which is adequate. Monitor conditions before the next irrigation.",
            request,
        )

    if request.tank_level < 500:
        return _response(
            RecommendationAction.CONSERVE,
            f"Available tank water is low at {request.tank_level:,.0f} L. Conserve water and avoid non-essential irrigation.",
            request,
            water_saved_estimate=weekly_water_need,
        )

    if request.soil_moisture > 80:
        return _response(
            RecommendationAction.MONITOR,
            f"Soil moisture is high at {request.soil_moisture:.0f}%. Do not irrigate; the soil may be over-saturated.",
            request,
        )

    return _response(
        RecommendationAction.MONITOR,
        f"Soil moisture is {request.soil_moisture:.0f}%. Conditions are stable; continue monitoring before irrigating.",
        request,
    )
