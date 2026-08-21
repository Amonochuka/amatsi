package clients

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type PythonAIClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewPythonAIClient(baseURL string) *PythonAIClient {
	return &PythonAIClient{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

type RecommendationRequest struct {
	CropType            string  `json:"crop_type"`
	SoilType            string  `json:"soil_type"`
	Temperature         float64 `json:"temperature"`
	RainfallProbability float64 `json:"rainfall_probability"`
	SoilMoisture        float64 `json:"soil_moisture"`
	TankCapacityLiters  float64 `json:"tank_capacity_liters"`
}

type RecommendationResponse struct {
	Action             string  `json:"action"` // IRRIGATE, WAIT, MONITOR, CONSERVE
	Reason             string  `json:"reason"`
	WaterSavedEstimate float64 `json:"water_saved_estimate"`
}

func (c *PythonAIClient) GetRecommendation(ctx context.Context, reqData *RecommendationRequest) (*RecommendationResponse, error) {
	url := fmt.Sprintf("%s/predict", c.BaseURL)
	
	body, err := json.Marshal(reqData)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get AI recommendation: status %d", resp.StatusCode)
	}

	var res RecommendationResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	return &res, nil
}
