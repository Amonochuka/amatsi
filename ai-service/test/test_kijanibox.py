import httpx
import pytest

from app.clients.kijanibox_client import KijaniboxClient, KijaniboxError


def make_client(handler) -> KijaniboxClient:
    return KijaniboxClient(
        base_url="https://api.kijanibox.test",
        api_key="secret",
        transport=httpx.MockTransport(handler),
    )


def sample_payload() -> dict:
    return {
        "forecast_data": {
            "time": ["2026-08-21T12:00:00Z", "2026-08-21T13:00:00Z"],
            "temperature": [24.5, 26.0],
            "precipitation_probability": [35.0, 40.0],
            "soilmoisture_0to10cm": [45.0, 44.0],
        }
    }


def test_get_land_forecast_uses_first_entry_and_bearer_auth():
    seen_headers = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen_headers.update(request.headers)
        return httpx.Response(200, json=sample_payload())

    client = make_client(handler)
    forecast = client.get_land_forecast(-1.29, 36.82)

    assert forecast.temperature_celsius == 24.5
    assert forecast.rainfall_probability == 35.0
    assert forecast.soil_moisture == 45.0
    assert seen_headers["authorization"] == "Bearer secret"


def test_convenience_accessors_match_go_client_contract():
    client = make_client(lambda request: httpx.Response(200, json=sample_payload()))
    temperature, rain = client.get_weather(0.0, 0.0)

    assert temperature == 24.5
    assert rain == 35.0
    assert client.get_soil_moisture(0.0, 0.0) == 45.0
    assert client.get_rainfall_probability(0.0, 0.0) == 35.0


def test_http_error_status_raises_kijanibox_error():
    client = make_client(lambda request: httpx.Response(503))

    with pytest.raises(KijaniboxError, match="status 503"):
        client.get_land_forecast(0.0, 0.0)


def test_network_failure_is_wrapped():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("boom")

    client = make_client(handler)

    with pytest.raises(KijaniboxError, match="kijanibox request failed"):
        client.get_land_forecast(0.0, 0.0)


@pytest.mark.parametrize("missing_key", ["temperature", "precipitation_probability", "soilmoisture_0to10cm"])
def test_missing_arrays_raise_kijanibox_error(missing_key):
    payload = sample_payload()
    payload["forecast_data"].pop(missing_key)
    client = make_client(lambda request: httpx.Response(200, json=payload))

    with pytest.raises(KijaniboxError, match="missing required values"):
        client.get_land_forecast(0.0, 0.0)


def test_empty_arrays_raise_kijanibox_error():
    payload = sample_payload()
    payload["forecast_data"]["temperature"] = []
    client = make_client(lambda request: httpx.Response(200, json=payload))

    with pytest.raises(KijaniboxError, match="missing required values"):
        client.get_land_forecast(0.0, 0.0)
