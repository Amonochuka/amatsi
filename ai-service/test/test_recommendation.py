import pytest

from app.models.request import RecommendationRequest
from app.models.response import RecommendationAction
from app.services.recommendation import (
	calculate_water_needed,
	calculate_water_saved,
	generate_recommendation,
)


def make_request(**overrides: object) -> RecommendationRequest:
	values: dict[str, object] = {
		"soil_moisture": 50,
		"rain_probability": 10,
		"tank_level": 1000,
		"crop_type": "maize",
		"field_size": 10,
		"temperature": 25,
		"humidity": 60,
	}
	values.update(overrides)
	return RecommendationRequest(**values)


def test_rain_takes_precedence_and_reports_saved_water() -> None:
	result = generate_recommendation(make_request(rain_probability=61, soil_moisture=10))
	assert result.action == RecommendationAction.WAIT
	assert result.water_saved == 183


def test_dry_soil_recommends_irrigation() -> None:
	result = generate_recommendation(make_request(soil_moisture=29))
	assert result.action == RecommendationAction.IRRIGATE
	assert result.water_volume == 300


@pytest.mark.parametrize("moisture", [30, 60, 75, 80, 81])
def test_non_dry_soil_is_monitored_when_tank_is_available(moisture: float) -> None:
	result = generate_recommendation(make_request(soil_moisture=moisture))
	assert result.action == RecommendationAction.MONITOR


def test_low_tank_recommends_conservation() -> None:
	result = generate_recommendation(make_request(soil_moisture=70, tank_level=499))
	assert result.action == RecommendationAction.CONSERVE


def test_low_tank_does_not_override_moisture_monitoring_rule() -> None:
	result = generate_recommendation(make_request(soil_moisture=60, tank_level=100))
	assert result.action == RecommendationAction.MONITOR


def test_over_saturation_reason_is_actionable() -> None:
	result = generate_recommendation(make_request(soil_moisture=81))
	assert "over-saturated" in result.reason


@pytest.mark.parametrize(
	("crop", "expected"),
	[("maize", 30), ("beans", 20), ("tomatoes", 35), ("rice", 40), ("unknown", 25)],
)
def test_crop_water_requirements(crop: str, expected: float) -> None:
	assert calculate_water_needed(crop, 2) == expected * 2


def test_crop_names_are_normalized() -> None:
	assert calculate_water_needed(" TOMATOES ", 1) == 35


def test_water_saved_is_probability_weighted() -> None:
	assert calculate_water_saved("WAIT", 50, 1000) == 500
	assert calculate_water_saved("IRRIGATE", 90, 1000) == 0


def test_request_rejects_invalid_percentage() -> None:
	with pytest.raises(ValueError):
		RecommendationRequest(soil_moisture=101)


# ============================================================================
# test/test_recommendation.py — UNIT TESTS FOR THE RULE ENGINE
# Component: Person D (AI & Integration Specialist)
#
# Pytest coverage for app/services/recommendation.py: all 5 rules from README
# section 6.2 plus the water requirement and water-saved calculations.
#
# WHAT NEEDS TO BE DONE:
# - Test Rule 1: rain_probability > 60%  -> action == "WAIT" and water_saved > 0.
# - Test Rule 2: soil_moisture < 30%     -> action == "IRRIGATE" and
#   water_volume matches CROP_WATER_NEEDS x field_size.
# - Test Rule 3: soil_moisture between 30% and 60% -> action == "MONITOR".
# - Test Rule 4: tank_level < 500L       -> action == "CONSERVE".
# - Test Rule 5: soil_moisture > 80%     -> action == "MONITOR" and reason
#   contains an over-saturation warning.
# - Test rule precedence when multiple rules match (which rule wins?).
# - Test calculate_water_needed for each crop (maize 30, beans 20, tomatoes 35,
#   rice 40, default 25 L/m2/week) and for unknown crop types.
# - Test calculate_water_saved for the WAIT action.
# - Test boundary values (exactly 30%, 60%, 80%, 500L) — document expected outcome.
# - Also test helpers (utils/helpers.py) conversions (acre/ha -> m2).
# - TODO(Person D): run with `python -m pytest ai-service/test` from repo root.
#
# Feature references: 6.2, 3.7-3.10, 19.7
# ============================================================================