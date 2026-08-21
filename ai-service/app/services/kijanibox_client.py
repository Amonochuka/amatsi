"""Lightweight stub for external KijaniBox weather and soil data access."""

from __future__ import annotations


def get_weather(lat: float | None = None, lon: float | None = None) -> dict:
    return {
        "temperature_c": 24.0,
        "humidity_percent": 72.0,
        "rain_probability_percent": 68.0,
        "rainfall_expected_mm": 18.0,
        "source": "KijaniBox stub",
        "lat": lat,
        "lon": lon,
    }


def get_soil_moisture(lat: float | None = None, lon: float | None = None) -> dict:
    return {
        "soil_moisture_percent": 58.0,
        "source": "KijaniBox stub",
        "lat": lat,
        "lon": lon,
    }


def get_rainfall_probability(lat: float | None = None, lon: float | None = None) -> dict:
    return {
        "rain_probability_percent": 68.0,
        "source": "KijaniBox stub",
        "lat": lat,
        "lon": lon,
    }
