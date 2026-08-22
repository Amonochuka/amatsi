from app.models.request import RecommendationRequest
from app.services.recommendation import calculate_water_needed, generate_recommendation
from utils.helpers import hectares_to_square_metres

def test_rain_has_highest_priority_and_saves_water():
    result = generate_recommendation(RecommendationRequest(rainfall_probability=70, soil_moisture=10, tank_capacity_liters=100))
    assert result.action == "WAIT"
    assert result.water_saved_estimate > 0

def test_dry_soil_recommends_irrigation_with_crop_water_need():
    result = generate_recommendation(RecommendationRequest(crop_type="maize", field_size_square_m=10, soil_moisture=29))
    assert result.action == "IRRIGATE"
    assert result.water_volume_liters == 300

def test_adequate_soil_moisture_recommends_monitoring():
    assert generate_recommendation(RecommendationRequest(soil_moisture=30)).action == "MONITOR"

def test_low_tank_conserves_when_earlier_rules_do_not_match():
    assert generate_recommendation(RecommendationRequest(soil_moisture=70, tank_capacity_liters=499)).action == "CONSERVE"

def test_high_soil_moisture_warns_about_over_saturation():
    result = generate_recommendation(RecommendationRequest(soil_moisture=81))
    assert result.action == "MONITOR"
    assert "over-saturated" in result.reason

def test_water_calculation_and_hectare_conversion():
    assert calculate_water_needed("beans", 10) == 200
    assert calculate_water_needed("unknown", 10) == 250
    assert hectares_to_square_metres(1) == 10_000
