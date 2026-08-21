from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class RecommendationAction(StrEnum):
	WAIT = "WAIT"
	IRRIGATE = "IRRIGATE"
	MONITOR = "MONITOR"
	CONSERVE = "CONSERVE"


class RecommendationResponse(BaseModel):
	action: RecommendationAction
	reason: str = Field(min_length=1)
	water_volume: float = Field(0, ge=0)
	water_saved: float = Field(0, ge=0)
	confidence: str
	timestamp: datetime