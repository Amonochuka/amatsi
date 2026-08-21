package clients

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type AfricasTalkingClient struct {
	Username   string
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
}

func NewAfricasTalkingClient(username, apiKey string, isSandbox bool) *AfricasTalkingClient {
	baseURL := "https://api.africastalking.com/version1/messaging"
	if isSandbox {
		baseURL = "https://api.sandbox.africastalking.com/version1/messaging"
	}
	return &AfricasTalkingClient{
		Username: username,
		APIKey:   apiKey,
		BaseURL:  baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type SMSResponse struct {
	SMSMessageData struct {
		Message    string `json:"Message"`
		Recipients []struct {
			StatusCode int    `json:"statusCode"`
			Number     string `json:"number"`
			Status     string `json:"status"`
			MessageId  string `json:"messageId"`
			Cost       string `json:"cost"`
		} `json:"Recipients"`
	} `json:"SMSMessageData"`
}

func (c *AfricasTalkingClient) SendSMS(ctx context.Context, to, message string) error {
	data := url.Values{}
	data.Set("username", c.Username)
	data.Set("to", to)
	data.Set("message", message)

	req, err := http.NewRequestWithContext(ctx, "POST", c.BaseURL, strings.NewReader(data.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("apiKey", c.APIKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send SMS: status %d", resp.StatusCode)
	}

	var res SMSResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return err
	}
	
	if len(res.SMSMessageData.Recipients) > 0 && res.SMSMessageData.Recipients[0].StatusCode > 102 {
		return fmt.Errorf("failed to deliver SMS: %s", res.SMSMessageData.Recipients[0].Status)
	}

	return nil
}
