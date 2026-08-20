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

func (c *KijaniboxClient) GetWeatherForecast(ctx context.Context, lat, lon float64) (*WeatherData, error) {
	url := fmt.Sprintf("%s/weather?lat=%f&lon=%f", c.BaseURL, lat, lon)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get weather: status %d", resp.StatusCode)
	}

	var data WeatherData
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}
	return &data, nil
}

func (c *KijaniboxClient) GetSoilMoisture(ctx context.Context, lat, lon float64) (*SoilData, error) {
	url := fmt.Sprintf("%s/soil?lat=%f&lon=%f", c.BaseURL, lat, lon)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get soil moisture: status %d", resp.StatusCode)
	}

	var data SoilData
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}
	return &data, nil
}
