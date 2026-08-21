#   get_rainfall_probability). NOTE: kijanibox_client.py does NOT exist yet in
#   this scaffold — create it as app/services/kijanibox_client.py.
# - Apply timeout + rate limiting on outbound calls (Feature 19.9).
# - Log every request/response for debugging.
#
# Feature references: 6.2, 4.x, 19.7, 19.9
# ============================================================================
import logging

from fastapi import APIRouter

from app.models.request import RecommendationRequest
from app.models.response import RecommendationResponse
from app.services.recommendation import generate_recommendation


logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/predict", response_model=RecommendationResponse)
def predict(request: RecommendationRequest) -> RecommendationResponse:
	recommendation = generate_recommendation(request)
	logger.info("Generated %s recommendation", recommendation.action)
	return recommendation