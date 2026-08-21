import pytest

from app.models.request import RecommendationRequest
from app.models.response import RecommendationAction, RecommendationResponse
from app.services.sms import SUPPORTED_LANGUAGES, format_recommendation_sms


def make_response(action: RecommendationAction) -> RecommendationResponse:
    return RecommendationResponse(
        action=action,
        reason="test",
        water_saved_estimate=0,
        water_volume_liters=300,
        confidence="High",
        generated_at="2026-08-21T12:00:00Z",
    )


def make_request(**overrides) -> RecommendationRequest:
    values = {
        "crop_type": "maize",
        "soil_moisture": 25,
        "rainfall_probability": 10,
        "tank_capacity_liters": 900,
    }
    values.update(overrides)
    return RecommendationRequest(**values)


@pytest.mark.parametrize("language", SUPPORTED_LANGUAGES)
@pytest.mark.parametrize("action", list(RecommendationAction))
def test_every_action_has_a_template_in_every_language(language, action):
    message = format_recommendation_sms(make_request(), make_response(action), language)

    assert message.startswith("AMATSI:")
    assert "{" not in message
    assert len(message) <= 160


@pytest.mark.parametrize("language", SUPPORTED_LANGUAGES)
def test_irrigate_message_contains_volume_and_crop(language):
    message = format_recommendation_sms(
        make_request(), make_response(RecommendationAction.IRRIGATE), language
    )

    assert "300" in message
    assert "maize" in message


def test_unknown_language_falls_back_to_english():
    english = format_recommendation_sms(make_request(), make_response(RecommendationAction.WAIT))
    fallback = format_recommendation_sms(
        make_request(), make_response(RecommendationAction.WAIT), "xx"
    )

    assert fallback == english
