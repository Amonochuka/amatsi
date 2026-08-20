# ============================================================================
# app/services/recommendation.py — RULE-BASED RECOMMENDATION ENGINE
# Component: Person D (AI & Integration Specialist)
#
# Core business logic implementing the 5 rules from README section 6.2 plus all
# water calculations. This is the heart of the AI service; keep it pure (no I/O)
# so it is trivially unit-testable.
#
# WHAT NEEDS TO BE DONE:
# - CROP_WATER_NEEDS dict: water required per m2 per week:
#   {"maize": 30.0, "beans": 20.0, "tomatoes": 35.0, "rice": 40.0}
#   with DEFAULT = 25.0 for any unknown crop_type.
# - calculate_water_needed(crop_type, field_size) -> liters
#   (crop requirement per m2 x field_size; see utils/helpers.py for conversions).
# - calculate_water_saved(action, rain_probability, ...) -> liters
#   (liters a farmer saves by NOT irrigating — e.g. from WAIT when rain is
#   expected; display as "water saved", feature 3.9).
# - generate_recommendation(request) -> RecommendationResponse implementing:
#   Rule 1: rain_probability > 60%  -> action WAIT   (+ water_saved calc)
#   Rule 2: soil_moisture < 30%     -> action IRRIGATE (+ water_volume)
#   Rule 3: soil_moisture 30-60%    -> action MONITOR
#   Rule 4: tank_level < 500L       -> action CONSERVE
#   Rule 5: soil_moisture > 80%     -> action MONITOR (+ over-saturation warning)
#   (Use the first rule that triggers; document precedence explicitly.)
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