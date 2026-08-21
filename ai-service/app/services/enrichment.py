"""Fill missing sensor inputs from the live KijaniBox land forecast.

The Go gateway normally supplies rainfall and soil values itself; this
enrichment is a convenience for direct calls that only know the farm
coordinates. Any KijaniBox failure degrades gracefully to the request's own
defaults so the rule engine always produces an answer.
"""

import logging

from app.clients.kijanibox_client import KijaniboxError, KijaniboxClient
from app.clients.mock_data import MockKijaniboxClient
from app.models.request import RecommendationRequest

logger = logging.getLogger(__name__)

ENRICHABLE_FIELDS = ("rainfall_probability", "soil_moisture")


def enrich_from_kijanibox(
    request: RecommendationRequest,
    client: KijaniboxClient | MockKijaniboxClient | None,
) -> RecommendationRequest:
    if client is None or request.latitude is None or request.longitude is None:
        return request

    missing = [field for field in ENRICHABLE_FIELDS if field not in request.model_fields_set]
    if not missing:
        return request

    try:
        forecast = client.get_land_forecast(request.latitude, request.longitude)
    except KijaniboxError as exc:
        logger.warning("KijaniBox unavailable, using supplied defaults: %s", exc)
        return request

    supplied = {field: getattr(request, field) for field in request.model_fields_set}
    if "rainfall_probability" in missing:
        supplied["rainfall_probability"] = forecast.rainfall_probability
        logger.info(
            "Enriched rainfall_probability=%.0f%% from KijaniBox", forecast.rainfall_probability
        )
    if "soil_moisture" in missing:
        supplied["soil_moisture"] = forecast.soil_moisture
        logger.info("Enriched soil_moisture=%.0f%% from KijaniBox", forecast.soil_moisture)
    return RecommendationRequest(**supplied)
