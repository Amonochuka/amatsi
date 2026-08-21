# AI Service Integration Guide

This service generates irrigation recommendations from farm and environmental data. It is a stateless HTTP service: the caller supplies the current data, and the service returns one recommendation.

## Service Contract

Start the service from the repository root with:

```bash
cd ai-service
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Endpoints:

- `GET /health` returns `{"status": "ok"}`.
- `POST /predict` validates the input and returns a recommendation.

Example request:

```json
{
  "soil_moisture": 20,
  "rain_probability": 10,
  "tank_level": 1000,
  "crop_type": "beans",
  "field_size": 10,
  "temperature": 25,
  "humidity": 60
}
```

Units are percent for moisture, rain probability, and humidity; liters for tank level; square meters for field size; degrees Celsius for temperature. `crop_type` is case-insensitive. `rainfall_expected`, `lat`, and `lon` are accepted for compatibility, but live weather and KijaniBox lookups are not implemented by this service.

Example response:

```json
{
  "action": "IRRIGATE",
  "reason": "Soil moisture is low at 20%; irrigate now.",
  "water_volume": 200,
  "water_saved": 0,
  "confidence": "High",
  "timestamp": "2026-08-21T12:00:00Z"
}
```

Invalid values, such as percentages outside `0` to `100`, return HTTP `422` with FastAPI validation details.

## Backend Integration

The Go backend should be the only application service that calls this API in production:

1. Authenticate the farmer and authorize access to the selected farm.
2. Load farm details and the latest environmental readings.
3. Convert the farm area from hectares to square meters before sending `field_size`.
4. `POST` the request JSON to the configured AI service URL, with a short client timeout.
5. Validate the response, persist the recommendation, and optionally queue an SMS.
6. Return the persisted recommendation to the frontend through the backend API.

The backend should treat an unavailable AI service as a temporary upstream error. It should not invent a recommendation when the AI request fails. A retry or cached recommendation policy belongs in the backend, where authentication, persistence, and retry ownership already live.

Recommended configuration:

```text
AI_SERVICE_URL=http://ai-service:8000
```

For local development, use `http://localhost:8000` when the AI service runs directly on the host.

## Frontend Integration

The frontend should call the Go backend recommendation endpoint, not `/predict` directly. This keeps service credentials and internal topology private and ensures the backend can enforce farmer and farm authorization.

The frontend maps the response as follows:

- `action`: primary recommendation badge (`WAIT`, `IRRIGATE`, `MONITOR`, or `CONSERVE`)
- `reason`: human-readable explanation
- `water_volume`: liters to apply when action is `IRRIGATE`
- `water_saved`: estimated liters avoided by following the recommendation
- `confidence`: completeness indicator (`High`, `Medium`, or `Low`)
- `timestamp`: generation time in UTC

The UI should show a loading state while the backend is generating a recommendation, an error state for failed requests, and the last cached recommendation when offline. It should not recalculate the action in browser code.

## Rule Engine Behavior

Rules are deterministic and evaluated in this order. The first matching rule wins:

1. `rain_probability > 60` -> `WAIT`
2. `soil_moisture < 30` -> `IRRIGATE`
3. `soil_moisture <= 60` -> `MONITOR`
4. `tank_level < 500` -> `CONSERVE`
5. `soil_moisture > 80` -> `MONITOR` with an over-saturation warning
6. Otherwise -> `MONITOR`

This means anticipated rain overrides dry-soil irrigation, and a low tank does not override the earlier moisture-monitoring rule. Exact boundaries are intentional: `60%` rain probability does not trigger `WAIT`; `30%` moisture is not dry; `60%` moisture is monitored; and `500L` is not considered low.

Water requirements are weekly estimates per square meter:

- maize: `30 L/m2`
- beans: `20 L/m2`
- tomatoes: `35 L/m2`
- onions: `30 L/m2`
- cabbage: `30 L/m2`
- potatoes: `25 L/m2`
- rice: `40 L/m2`
- unknown crops: `25 L/m2`

For `WAIT`, `water_saved` is estimated as `water_needed * rain_probability / 100`. It is an estimate, not a measured water saving.

## Rule Engine Limitations

- This is a transparent threshold engine, not a trained or predictive ML model.
- It does not fetch weather, soil, satellite, or sensor data. Values must be supplied by the caller.
- It does not account for crop growth stage, root depth, evapotranspiration, soil texture, slope, irrigation efficiency, field geometry, or local water restrictions.
- `field_size` must already be in square meters; no hectare or acre conversion occurs inside the API.
- `rainfall_expected` is accepted for contract compatibility but currently does not alter `rain_probability`.
- Missing numeric fields use zero defaults for backward-compatible partial requests. Such requests produce `Low` or `Medium` confidence and should not be treated as equivalent to measured zero readings.
- The engine does not persist history, send SMS, authenticate callers, rate-limit requests, or coordinate retries.
- Recommendations are advisory. The backend and farmer workflow should provide appropriate safeguards before irrigation is carried out.

The focused tests in `test/test_recommendation.py` and `test/test_api.py` define the current behavior and boundary decisions.
