package clients

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type KijaniboxClient struct {
	BaseURL      string
	APIKey       string
	Mock         bool
	MockScenario string
	HTTPClient   *http.Client
}

func NewKijaniboxClient(baseURL, apiKey string, mock bool, mockScenario string) *KijaniboxClient {
	return &KijaniboxClient{
		BaseURL:      baseURL,
		APIKey:       apiKey,
		Mock:         mock,
		MockScenario: mockScenario,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type WeatherData struct {
	Temperature         float64 `json:"temperature"`
	RainfallProbability float64 `json:"rainfall_probability"`
}

type SoilData struct {
	MoistureLevel float64 `json:"moisture_level"`
}

type agroClimateLandResponse struct {
	ForecastData struct {
		Time                     []string  `json:"time"`
		Temperature              []float64 `json:"temperature"`
		PrecipitationProbability []float64 `json:"precipitation_probability"`
		SoilMoisture0To10CM      []float64 `json:"soilmoisture_0to10cm"`
	} `json:"forecast_data"`
}

// mockLandForecast is a canned forecast for one mock scenario. Values mirror
// the AI service's offline fixtures so both layers stay consistent.
type mockLandForecast struct {
	Temperature         float64
	RainfallProbability float64
	SoilMoisture        float64
}

var mockKijaniScenarios = map[string]mockLandForecast{
	"normal":    {Temperature: 24.5, RainfallProbability: 35, SoilMoisture: 45},
	"dry":       {Temperature: 31, RainfallProbability: 10, SoilMoisture: 18},
	"rainy":     {Temperature: 21, RainfallProbability: 85, SoilMoisture: 55},
	"saturated": {Temperature: 19.5, RainfallProbability: 20, SoilMoisture: 88},
}

// GetLandForecast retrieves the combined weather and soil forecast from the
// verified SpaceIoTBox land endpoint. The endpoint's first hourly entry is
// used as the current forecast for a farm. In mock mode it returns the canned
// scenario instead of calling the network (no API token required).
func (c *KijaniboxClient) GetLandForecast(ctx context.Context, lat, lon float64) (*WeatherData, *SoilData, error) {
	if c.Mock {
		scenario, ok := mockKijaniScenarios[c.MockScenario]
		if !ok {
			scenario = mockKijaniScenarios["dry"]
		}
		return &WeatherData{
				Temperature:         scenario.Temperature,
				RainfallProbability: scenario.RainfallProbability,
			}, &SoilData{
				MoistureLevel: scenario.SoilMoisture,
			}, nil
	}

	url := fmt.Sprintf("%s/v1/agro_climate/land?lat=%f&lon=%f", c.BaseURL, lat, lon)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, nil, err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, nil, fmt.Errorf("failed to get land forecast: status %d", resp.StatusCode)
	}

	var data agroClimateLandResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, nil, err
	}

	forecast := data.ForecastData
	if len(forecast.Time) == 0 ||
		len(forecast.Temperature) == 0 ||
		len(forecast.PrecipitationProbability) == 0 ||
		len(forecast.SoilMoisture0To10CM) == 0 {
		return nil, nil, fmt.Errorf("land forecast response is missing required values")
	}

	return &WeatherData{
			Temperature:         forecast.Temperature[0],
			RainfallProbability: forecast.PrecipitationProbability[0],
		}, &SoilData{
			MoistureLevel: forecast.SoilMoisture0To10CM[0],
		}, nil
}

func (c *KijaniboxClient) GetWeatherForecast(ctx context.Context, lat, lon float64) (*WeatherData, error) {
	weather, _, err := c.GetLandForecast(ctx, lat, lon)
	return weather, err
}

func (c *KijaniboxClient) GetSoilMoisture(ctx context.Context, lat, lon float64) (*SoilData, error) {
	_, soil, err := c.GetLandForecast(ctx, lat, lon)
	return soil, err
}
