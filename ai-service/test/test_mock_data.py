import pytest

from app.clients.mock_data import MOCK_LAND_FORECASTS, MockKijaniboxClient


@pytest.mark.parametrize(
    ("scenario", "expected_rain", "expected_soil"),
    [
        ("normal", 35.0, 45.0),
        ("dry", 10.0, 18.0),
        ("rainy", 85.0, 55.0),
        ("saturated", 20.0, 88.0),
    ],
)
def test_mock_client_serves_scenario_fixtures(scenario, expected_rain, expected_soil):
    client = MockKijaniboxClient(scenario=scenario)
    forecast = client.get_land_forecast(-1.29, 36.82)

    assert forecast.rainfall_probability == expected_rain
    assert forecast.soil_moisture == expected_soil
    assert scenario in MOCK_LAND_FORECASTS
