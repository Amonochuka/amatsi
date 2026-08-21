# - Compose a human-readable `reason` string (feature 3.8) and set confidence
#   based on how complete the input data is.
# - Return values as a RecommendationResponse (with timestamp, UTC).
# - TODO(Person D): KijaniBox live data (get_weather / get_soil_moisture /
#   get_rainfall_probability) is referenced in docs but NOT in this scaffold —
#   create it as app/services/kijanibox_client.py with timeout + error handling
#   (Feature 19.7/19.9) if live inputs are required.
#
# Feature references: 6.2, 3.7-3.10, 5.x, 13.2
# ============================================================================
from datetime import datetime, timezone

from app.models.request import RecommendationRequest
from app.models.response import RecommendationAction, RecommendationResponse


CROP_WATER_NEEDS = {
	"maize": 30.0,
	"beans": 20.0,
	"tomatoes": 35.0,
	"onions": 30.0,
	"cabbage": 30.0,
	"potatoes": 25.0,
	"rice": 40.0,
}
DEFAULT_WATER_NEED = 25.0


def calculate_water_needed(crop_type: str, field_size: float) -> float:
	rate = CROP_WATER_NEEDS.get(crop_type.strip().lower(), DEFAULT_WATER_NEED)
	return round(rate * field_size, 2)


def calculate_water_saved(action: RecommendationAction | str, rain_probability: float, water_needed: float) -> float:
	if str(action) != RecommendationAction.WAIT.value:
		return 0.0
	return round(water_needed * rain_probability / 100, 2)


def _confidence(request: RecommendationRequest) -> str:
	supplied = request.model_fields_set
	required = {"soil_moisture", "rain_probability", "tank_level", "field_size", "crop_type"}
	if required.issubset(supplied):
		return "High"
	if supplied & required:
		return "Medium"
	return "Low"


def generate_recommendation(request: RecommendationRequest) -> RecommendationResponse:
	water_needed = calculate_water_needed(request.crop_type, request.field_size)
	rain_probability = request.rain_probability

	# Precedence follows the product rules: anticipated rain, dryness, moisture
	# bands, then tank conservation. The final branch handles 60-80% moisture.
	if rain_probability > 60:
		action = RecommendationAction.WAIT
		reason = f"Rain is likely within 24 hours ({rain_probability:.0f}% probability)."
	elif request.soil_moisture < 30:
		action = RecommendationAction.IRRIGATE
		reason = f"Soil moisture is low at {request.soil_moisture:.0f}%; irrigate now."
	elif request.soil_moisture <= 60:
		action = RecommendationAction.MONITOR
		reason = f"Soil moisture is acceptable at {request.soil_moisture:.0f}%; check again tomorrow."
	elif request.tank_level < 500:
		action = RecommendationAction.CONSERVE
		reason = f"Tank level is low at {request.tank_level:.0f}L; conserve water."
	elif request.soil_moisture > 80:
		action = RecommendationAction.MONITOR
		reason = f"Soil may be over-saturated at {request.soil_moisture:.0f}%; do not irrigate."
	else:
		action = RecommendationAction.MONITOR
		reason = f"Soil moisture is stable at {request.soil_moisture:.0f}%; monitor conditions."

	return RecommendationResponse(
		action=action,
		reason=reason,
		water_volume=water_needed if action == RecommendationAction.IRRIGATE else 0,
		water_saved=calculate_water_saved(action, rain_probability, water_needed),
		confidence=_confidence(request),
		timestamp=datetime.now(timezone.utc),
	)