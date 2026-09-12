package clients

import (
	"context"
	"testing"
)

func TestKijaniMockScenarios(t *testing.T) {
	cases := map[string]struct {
		wantWeather WeatherData
		wantSoil    SoilData
	}{
		"dry": {
			wantWeather: WeatherData{Temperature: 31, RainfallProbability: 10},
			wantSoil:    SoilData{MoistureLevel: 18},
		},
		"normal": {
			wantWeather: WeatherData{Temperature: 24.5, RainfallProbability: 35},
			wantSoil:    SoilData{MoistureLevel: 45},
		},
		"rainy": {
			wantWeather: WeatherData{Temperature: 21, RainfallProbability: 85},
			wantSoil:    SoilData{MoistureLevel: 55},
		},
		"saturated": {
			wantWeather: WeatherData{Temperature: 19.5, RainfallProbability: 20},
			wantSoil:    SoilData{MoistureLevel: 88},
		},
	}

	for scenario, tc := range cases {
		t.Run(scenario, func(t *testing.T) {
			c := NewKijaniboxClient("", "", true, scenario)
			weather, soil, err := c.GetLandForecast(context.Background(), -1.29, 36.82)
			if err != nil {
				t.Fatalf("mock forecast returned error: %v", err)
			}
			if weather.Temperature != tc.wantWeather.Temperature ||
				weather.RainfallProbability != tc.wantWeather.RainfallProbability {
				t.Errorf("weather mismatch: got %+v want %+v", weather, &tc.wantWeather)
			}
			if soil.MoistureLevel != tc.wantSoil.MoistureLevel {
				t.Errorf("soil mismatch: got %+v want %+v", soil, &tc.wantSoil)
			}
		})
	}

	t.Run("unknown scenario falls back to dry", func(t *testing.T) {
		c := NewKijaniboxClient("", "", true, "bogus")
		weather, soil, err := c.GetLandForecast(context.Background(), 0, 0)
		if err != nil {
			t.Fatalf("fallback mock forecast returned error: %v", err)
		}
		if weather.Temperature != 31 || soil.MoistureLevel != 18 {
			t.Errorf("fallback should be dry, got weather=%+v soil=%+v", weather, soil)
		}
	})
}

func TestKijaniMockDisabledStillBuildsURL(t *testing.T) {
	c := NewKijaniboxClient("", "", false, "dry")
	if c.Mock {
		t.Fatal("mock should be disabled")
	}
}
