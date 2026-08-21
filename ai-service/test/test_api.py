from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_endpoint_returns_canonical_response() -> None:
    response = client.post(
        "/predict",
        json={
            "soil_moisture": 20,
            "rain_probability": 10,
            "tank_level": 1000,
            "crop_type": "beans",
            "field_size": 10,
            "temperature": 25,
            "humidity": 60,
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["action"] == "IRRIGATE"
    assert body["water_volume"] == 200
    assert body["water_saved"] == 0
    assert body["timestamp"]


def test_predict_endpoint_rejects_invalid_input() -> None:
    response = client.post("/predict", json={"soil_moisture": 101})
    assert response.status_code == 422
