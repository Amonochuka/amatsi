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