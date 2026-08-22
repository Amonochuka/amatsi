"""HTTP endpoint for irrigation recommendations."""

import logging
from typing import Annotated
from fastapi import APIRouter, Depends
from app.clients.kijanibox_client import KijaniboxClient
from app.clients.mock_data import MockKijaniboxClient
from app.deps import get_kijanibox_client
from app.models.request import RecommendationRequest
from app.models.response import RecommendationResponse
from app.services.enrichment import enrich_from_kijanibox
from app.services.recommendation import generate_recommendation

logger = logging.getLogger(__name__)
router = APIRouter(tags=["recommendations"])

@router.post("/predict", response_model=RecommendationResponse)
def predict(request: RecommendationRequest, kijanibox: Annotated[KijaniboxClient | MockKijaniboxClient | None, Depends(get_kijanibox_client)]) -> RecommendationResponse:
    enriched_request = enrich_from_kijanibox(request, kijanibox)
    recommendation = generate_recommendation(enriched_request)
    logger.info("Generated %s recommendation for crop=%s", recommendation.action, enriched_request.crop_type)
    return recommendation
