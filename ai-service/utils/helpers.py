# ============================================================================
# utils/helpers.py — SHARED HELPER FUNCTIONS
# Component: Person D (AI & Integration Specialist)
#
# Small pure helpers used across the service: unit conversions and formatting
# so the recommendation engine and responses stay clean.
#
# WHAT NEEDS TO BE DONE:
# - Field size conversions, e.g.:
#   - acres_to_sq_meters(acres)  (1 acre = 4046.86 m2)
#   - hectares_to_sq_meters(ha)  (1 ha = 10000 m2)
#   - normalize_field_size(size, unit)  (dispatch on unit: "m2"/"acre"/"ha")
# - Formatting helpers, e.g. liters -> rounded string, percent -> "78%",
#   timestamps -> ISO 8601 UTC; used by the `reason` and `water_saved` fields.
# - Input sanitization helpers if needed before passing to the rule engine.
# - TODO(Person D): confirm with the Go backend which units it sends so
#   conversions are reversible and consistent.
#
# Feature references: 6.2, 3.8-3.10
# ============================================================================