package clients

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type KijaniboxClient struct {
	BaseURL    string
	APIKey     string
	HTTPClient *http.Client
}

func NewKijaniboxClient(baseURL, apiKey string) *KijaniboxClient {
	return &KijaniboxClient{
		BaseURL: baseURL,
		APIKey:  apiKey,
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

// GetLandForecast retrieves the combined weather and soil forecast from the
// verified SpaceIoTBox land endpoint. The endpoint's first hourly entry is
// used as the current forecast for a farm.
func (c *KijaniboxClient) GetLandForecast(ctx context.Context, lat, lon float64) (*WeatherData, *SoilData, error) {
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
