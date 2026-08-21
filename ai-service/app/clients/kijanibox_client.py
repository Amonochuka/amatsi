"""KijaniBox land-climate API client.

Mirrors the Go integration in backend/internal/clients/kijanibox.go: a single
agro-climate land endpoint whose first forecast entry is treated as the
current weather and soil state for a farm.
"""

from typing import Annotated

import httpx
from pydantic import BaseModel, Field

DEFAULT_TIMEOUT_SECONDS = 10.0


class KijaniboxError(RuntimeError):
    """Raised when the KijaniBox API is unreachable or returns unusable data."""


Latitude = Annotated[float, Field(ge=-90, le=90)]
Longitude = Annotated[float, Field(ge=-180, le=180)]


class LandForecast(BaseModel):
    temperature_celsius: float
    rainfall_probability: float = Field(ge=0, le=100)
    soil_moisture: float = Field(ge=0, le=100)


def _first(values, label: str) -> float:
    if not values:
        raise KijaniboxError(f"land forecast response is missing required values ({label})")
    return values[0]


class KijaniboxClient:
    def __init__(
        self,
        base_url: str,
        api_key: str,
        timeout_seconds: float = DEFAULT_TIMEOUT_SECONDS,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        self._client = httpx.Client(
            base_url=base_url.rstrip("/"),
            timeout=timeout_seconds,
            transport=transport,
            headers={
                "Accept": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
        )

    def close(self) -> None:
        self._client.close()

    def get_land_forecast(self, lat: Latitude, lon: Longitude) -> LandForecast:
        try:
            response = self._client.get(
                "/v1/agro_climate/land", params={"lat": lat, "lon": lon}
            )
        except httpx.HTTPError as exc:
            raise KijaniboxError(f"kijanibox request failed: {exc}") from exc

        if response.status_code != httpx.codes.OK:
            raise KijaniboxError(f"failed to get land forecast: status {response.status_code}")

        try:
            payload = response.json()
            forecast = payload["forecast_data"]
            return LandForecast(
                temperature_celsius=_first(forecast["temperature"], "temperature"),
                rainfall_probability=_first(
                    forecast["precipitation_probability"], "precipitation_probability"
                ),
                soil_moisture=_first(forecast["soilmoisture_0to10cm"], "soil moisture"),
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise KijaniboxError("land forecast response is missing required values") from exc

    def get_weather(self, lat: Latitude, lon: Longitude) -> tuple[float, float]:
        forecast = self.get_land_forecast(lat, lon)
        return forecast.temperature_celsius, forecast.rainfall_probability

    def get_soil_moisture(self, lat: Latitude, lon: Longitude) -> float:
        return self.get_land_forecast(lat, lon).soil_moisture

    def get_rainfall_probability(self, lat: Latitude, lon: Longitude) -> float:
        return self.get_land_forecast(lat, lon).rainfall_probability
