from fastapi.testclient import TestClient

import app.deps as deps
from app.clients.mock_data import MockKijaniboxClient
from app.main import app


def override_client(client):
    def _override():
        return client

    return _override


def test_predict_without_client_keeps_supplied_values():
    app.dependency_overrides[deps.get_kijanibox_client] = override_client(None)
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={"rainfall_probability": 70, "soil_moisture": 10, "tank_capacity_liters": 100},
        )

    assert response.status_code == 200
    assert response.json()["action"] == "WAIT"


def test_predict_enriches_missing_sensor_data_from_kijanibox():
    app.dependency_overrides[deps.get_kijanibox_client] = override_client(
        MockKijaniboxClient("dry")
    )
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={
                "crop_type": "maize",
                "tank_capacity_liters": 2000,
                "latitude": -1.29,
                "longitude": 36.82,
            },
        )

    body = response.json()
    assert response.status_code == 200
    assert body["action"] == "IRRIGATE"
    assert body["confidence"] == "High"


def test_predict_with_rainy_mock_waits_and_reports_medium_confidence():
    app.dependency_overrides[deps.get_kijanibox_client] = override_client(
        MockKijaniboxClient("rainy")
    )
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={"soil_moisture": 40, "latitude": -1.29, "longitude": 36.82},
        )

    body = response.json()
    assert body["action"] == "WAIT"
    assert body["confidence"] == "Medium"


def test_predict_survives_kijanibox_outage():
    from app.clients.kijanibox_client import KijaniboxError

    class BrokenClient:
        def get_land_forecast(self, lat, lon):
            raise KijaniboxError("status 503")

    app.dependency_overrides[deps.get_kijanibox_client] = override_client(BrokenClient())
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={"latitude": -1.29, "longitude": 36.82},
        )

    assert response.status_code == 200
    assert response.json()["action"] == "MONITOR"
