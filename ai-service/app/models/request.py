from pydantic import BaseModel, Field, field_validator


class RecommendationRequest(BaseModel):
	soil_moisture: float = Field(0, ge=0, le=100)
	rain_probability: float = Field(0, ge=0, le=100)
	tank_level: float = Field(0, ge=0)
	crop_type: str = Field("default", min_length=1, max_length=50)
	field_size: float = Field(0, ge=0)
	temperature: float = Field(0, ge=-80, le=80)
	humidity: float = Field(0, ge=0, le=100)
	rainfall_expected: float | None = Field(None, ge=0)
	lat: float | None = Field(None, ge=-90, le=90)
	lon: float | None = Field(None, ge=-180, le=180)

	@field_validator("crop_type")
	@classmethod
	def normalize_crop_type(cls, value: str) -> str:
		return value.strip().lower()