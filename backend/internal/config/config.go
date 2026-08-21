/*
 * ============================================================================
 * internal/config/config.go — ENVIRONMENT CONFIG LOADER
 * Component: Person A + <Go API / Team Lead>
 *
 * Single source of truth for all environment variables. Every package reads
 * configuration fields from this struct instead of touching os.Getenv.
 * ============================================================================
 */

package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// AppConfig holds all environment configuration for the application.
// Every package reads from this struct instead of calling os.Getenv directly.
type AppConfig struct {
	// Server
	Port string

	// Supabase / PostgreSQL
	SupabaseDBURL string

	// JWT Authentication
	JWTSecret        string
	JWTTokenTTL      time.Duration
	JWTSigningMethod string

	// KijaniBox API
	KijaniBoxAPIKey  string
	KijaniBoxBaseURL string

	// Africa's Talking SMS
	AfricaTalkingAPIKey      string
	AfricaTalkingUsername    string
	AfricaTalkingSenderID    string
	AfricaTalkingCallbackURL string

	// Redis / Upstash
	RedisURL string

	// Python AI Service
	AIServiceURL string

	// CORS
	AllowedOrigins []string
}

// Load reads environment variables from .env (if present) and os.Getenv,
// applies defaults for optional fields, and returns an error listing all
// missing required variables so startup fails loudly.
func Load() (*AppConfig, error) {
	// Load .env file if it exists; ignore error if not found
	_ = godotenv.Load()

	cfg := &AppConfig{
		// Defaults
		Port:                     getEnvOrDefault("PORT", "8080"),
		JWTTokenTTL:              24 * time.Hour,
		JWTSigningMethod:         "HS256",
		KijaniBoxBaseURL:         getEnvOrDefault("KIJANIBOX_BASE_URL", "https://api.kijanibox.com"),
		AfricaTalkingSenderID:    getEnvOrDefault("AFRICA_TALKING_SENDER_ID", "KijaniFarmer"),
		AfricaTalkingCallbackURL: os.Getenv("AFRICA_TALKING_CALLBACK_URL"),

		// Required (loaded below)
		SupabaseDBURL:         os.Getenv("SUPABASE_DB_URL"),
		JWTSecret:             os.Getenv("JWT_SECRET"),
		KijaniBoxAPIKey:       os.Getenv("KIJANIBOX_API_KEY"),
		AfricaTalkingAPIKey:   os.Getenv("AFRICA_TALKING_API_KEY"),
		AfricaTalkingUsername: os.Getenv("AFRICA_TALKING_USERNAME"),
		RedisURL:              os.Getenv("REDIS_URL"),
		AIServiceURL:          os.Getenv("AI_SERVICE_URL"),
	}

	// Parse allowed origins (comma-separated)
	originsStr := getEnvOrDefault("ALLOWED_ORIGINS", "http://localhost:3000")
	cfg.AllowedOrigins = strings.Split(originsStr, ",")
	for i := range cfg.AllowedOrigins {
		cfg.AllowedOrigins[i] = strings.TrimSpace(cfg.AllowedOrigins[i])
	}

	// Validate required fields
	var missing []string
	requiredFields := map[string]string{
		"SUPABASE_DB_URL":         cfg.SupabaseDBURL,
		"JWT_SECRET":              cfg.JWTSecret,
		"KIJANIBOX_API_KEY":       cfg.KijaniBoxAPIKey,
		"AFRICA_TALKING_API_KEY":  cfg.AfricaTalkingAPIKey,
		"AFRICA_TALKING_USERNAME": cfg.AfricaTalkingUsername,
		"REDIS_URL":               cfg.RedisURL,
		"AI_SERVICE_URL":          cfg.AIServiceURL,
	}
	for name, value := range requiredFields {
		if value == "" {
			missing = append(missing, name)
		}
	}

	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %s", strings.Join(missing, ", "))
	}

	return cfg, nil
}

// getEnvOrDefault returns the value of the environment variable named by key,
// or the provided default if the variable is empty or unset.
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
