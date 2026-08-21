"""Offline KijaniBox fixtures and a client that serves them without network.

The payloads use the exact wire format of /v1/agro_climate/land so tests and
demos exercise the same parsing code path as the live API.
"""

from typing import Literal

import httpx

from app.clients.kijanibox_client import KijaniboxClient

MockScenario = Literal["normal", "dry", "rainy", "saturated"]

MOCK_LAND_FORECASTS: dict[MockScenario, dict] = {
    "normal": {
        "forecast_data": {
            "time": ["2026-08-21T12:00:00Z"],
            "temperature": [24.5],
            "precipitation_probability": [35.0],
            "soilmoisture_0to10cm": [45.0],
        }
    },
    "dry": {
        "forecast_data": {
            "time": ["2026-08-21T12:00:00Z"],
            "temperature": [31.0],
            "precipitation_probability": [10.0],
            "soilmoisture_0to10cm": [18.0],
        }
    },
    "rainy": {
        "forecast_data": {
            "time": ["2026-08-21T12:00:00Z"],
            "temperature": [21.0],
            "precipitation_probability": [85.0],
            "soilmoisture_0to10cm": [55.0],
        }
    },
    "saturated": {
        "forecast_data": {
            "time": ["2026-08-21T12:00:00Z"],
            "temperature": [19.5],
            "precipitation_probability": [20.0],
            "soilmoisture_0to10cm": [88.0],
        }
    },
}


class MockKijaniboxClient(KijaniboxClient):
    def __init__(self, scenario: MockScenario = "normal") -> None:
        payload = MOCK_LAND_FORECASTS[scenario]

        def handler(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, json=payload)

        super().__init__(
            base_url="https://mock.kijanibox.local",
            api_key="mock-key",
            transport=httpx.MockTransport(handler),
        )
