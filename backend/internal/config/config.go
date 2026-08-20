package config

import (
	"fmt"
	"os"
)

// Config holds all configuration values loaded from environment variables.
type Config struct {
	// Database
	DatabaseURL string

	// Redis
	RedisAddr string

	// Server
	Port      string
	JWTSecret string

	// External API Keys
	KijaniboxAPIKey      string
	KijaniboxBaseURL     string
	AfricasTalkingAPIKey string
	AfricasTalkingFrom   string
	PythonAIBaseURL      string

	// MQTT
	MQTTBrokerURI string
}

// Load reads configuration from environment variables and returns a Config.
// It returns an error if any required variable is missing.
func Load() (*Config, error) {
	cfg := &Config{
		DatabaseURL:          os.Getenv("DATABASE_URL"),
		RedisAddr:            getEnvOrDefault("REDIS_ADDR", "localhost:6379"),
		Port:                 getEnvOrDefault("PORT", "8080"),
		JWTSecret:            os.Getenv("JWT_SECRET"),
		KijaniboxAPIKey:      os.Getenv("KIJANIBOX_API_KEY"),
		KijaniboxBaseURL:     getEnvOrDefault("KIJANIBOX_BASE_URL", "https://api.kijanibox.com"),
		AfricasTalkingAPIKey: os.Getenv("AFRICAS_TALKING_API_KEY"),
		AfricasTalkingFrom:   getEnvOrDefault("AFRICAS_TALKING_FROM", "AMATSI"),
		PythonAIBaseURL:      getEnvOrDefault("PYTHON_AI_BASE_URL", "http://localhost:8000"),
		MQTTBrokerURI:        getEnvOrDefault("MQTT_BROKER_URI", "tcp://localhost:1883"),
	}

	// Validate required fields
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET environment variable is required")
	}
	if cfg.KijaniboxAPIKey == "" {
		return nil, fmt.Errorf("KIJANIBOX_API_KEY environment variable is required")
	}
	if cfg.AfricasTalkingAPIKey == "" {
		return nil, fmt.Errorf("AFRICAS_TALKING_API_KEY environment variable is required")
	}

	return cfg, nil
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
