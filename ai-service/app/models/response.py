"""Schemas returned by the irrigation recommendation service."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class RecommendationAction(str, Enum):
    WAIT = "WAIT"
    IRRIGATE = "IRRIGATE"
    MONITOR = "MONITOR"
    CONSERVE = "CONSERVE"


class RecommendationResponse(BaseModel):
    action: RecommendationAction
    reason: str = Field(min_length=1, max_length=500)
    # This name is deliberately aligned with backend/internal/clients/python_ai.go.
    water_saved_estimate: float = Field(ge=0)
    water_volume_liters: float = Field(ge=0)
    confidence: str = Field(pattern="^(High|Medium|Low)$")
    generated_at: datetime
