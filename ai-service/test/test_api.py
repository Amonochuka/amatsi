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
            "rainfall_probability": 10,
            "tank_level": 1000,
            "crop_type": "beans",
            "field_size_square_m": 10,
            "temperature": 25,
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["action"] == "IRRIGATE"
    assert body["water_volume_liters"] == 200
    assert body["water_saved_estimate"] == 0
    assert body["generated_at"]


def test_predict_endpoint_rejects_invalid_input() -> None:
    response = client.post("/predict", json={"soil_moisture": 101})
    assert response.status_code == 422
