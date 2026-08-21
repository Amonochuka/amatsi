# ============================================================================
# app/models/request.py — RECOMMENDATION REQUEST MODEL
# Component: Person D (AI & Integration Specialist)
#
# Pydantic schema describing the inputs the prediction endpoint accepts from the
# Go backend / frontend when a recommendation is requested for a farm.
#
# WHAT NEEDS TO BE DONE:
# - Define Pydantic model `RecommendationRequest` with fields (all reasonable
#   defaults so partial data still works):
#   - soil_moisture: float (percent, 0-100)
#   - rain_probability: float (percent, 0-100)
#   - tank_level: float (liters)
#   - crop_type: str (e.g. "maize", "beans", "tomatoes", "rice", default)
#   - field_size: float (area in square meters; see utils/helpers.py conversions)
#   - temperature: float (Celsius)
#   - humidity: float (percent)
#   - rainfall_expected: float (mm, optional override of rain_probability)
#   - lat / lon: float (optional, used by KijaniBox client to fetch live data)
# - Add Field(ge=0, le=100) validation on percentages; Ge(0) on volumes/sizes.
# - TODO(Person D): keep field names aligned with the Go backend's JSON payload
#   in docs feature 6.2 / README section 6.2.
#
# Feature references: 6.2, 4.x (recommendation request flow)
# ============================================================================