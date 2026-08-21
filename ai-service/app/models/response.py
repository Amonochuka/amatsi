# ============================================================================
# app/models/response.py — RECOMMENDATION RESPONSE MODEL
# Component: Person D (AI & Integration Specialist)
#
# Pydantic schema describing the structured recommendation returned to the
# caller, matching what the frontend Recommendation Card displays
# (see frontend/components/dashboard/RecommendationCard.tsx).
#
# WHAT NEEDS TO BE DONE:
# - Define Pydantic model `RecommendationResponse` with:
#   - action: str (one of "WAIT" | "IRRIGATE" | "MONITOR" | "CONSERVE")
#   - reason: str (human-readable "why", e.g. "78% chance of rain in 24h")
#   - water_volume: float (liters to irrigate when action == IRRIGATE)
#   - water_saved: float (liters saved by following the action; feature 3.9)
#   - confidence: str ("High" | "Medium" | "Low") or float score
#   - timestamp: datetime (UTC, when the recommendation was generated)
# - Align action enum with README section 6.2 rules 1-5 ("WAIT", "IRRIGATE",
#   "MONITOR", "CONSERVE") so the frontend badge colors map correctly.
# - TODO(Person D): confirm field names/types with Person C (frontend) and the
#   Go backend serializer before finalizing.
#
# Feature references: 6.2, 3.6-3.10, 4.x
# ============================================================================