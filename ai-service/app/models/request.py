"""Schemas accepted by the irrigation recommendation service."""

from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field

Percentage = Annotated[float, Field(ge=0, le=100)]
NonNegative = Annotated[float, Field(ge=0)]
Positive = Annotated[float, Field(gt=0)]

class RecommendationRequest(BaseModel):
    """Environmental and farm data supplied by the Go API gateway."""
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)
    crop_type: str = Field(default="other", min_length=1, max_length=100)
    soil_type: str = Field(default="unknown", min_length=1, max_length=100)
    temperature: float = Field(default=25.0, ge=-50, le=70)
    rainfall_probability: Percentage = 0.0
    soil_moisture: Percentage = 50.0
    tank_level: NonNegative = Field(default=1_000.0, alias="tank_capacity_liters")
    field_size_square_m: Positive = Field(default=1_000.0)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
