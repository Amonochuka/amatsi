package workers

import (
	"context"
	"log/slog"

	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/config"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

// RecommendationProcessor generates recommendations for all farms. It is
// scheduled as a periodic Asynq task (e.g. daily) and runs server-side with no
// user context — it iterates the full farm list and reuses the same
// RecommendationService as the HTTP endpoint.
type RecommendationProcessor struct {
	service *services.RecommendationService
	farmRepo *repository.FarmRepository
}

func NewRecommendationProcessor(
	recRepo *repository.RecommendationRepository,
	weatherRepo *repository.WeatherRepository,
	farmRepo *repository.FarmRepository,
	userRepo *repository.UserRepository,
	kijani *clients.KijaniboxClient,
	ai *clients.PythonAIClient,
	mqtt *clients.MQTTClient,
	alertSvc *services.AlertService,
) *RecommendationProcessor {
	return &RecommendationProcessor{
		service: services.NewRecommendationService(
			recRepo,
			weatherRepo,
			farmRepo,
			userRepo,
			kijani,
			ai,
			mqtt,
			alertSvc,
		),
		farmRepo: farmRepo,
	}
}

// NewRecommendationProcessorFromConfig builds the processor from the app config
// and shared clients, mirroring how the HTTP handler wires the service.
func NewRecommendationProcessorFromConfig(
	db *pgxpool.Pool,
	cfg *config.AppConfig,
	asynqClient *asynq.Client,
	mqttClient *clients.MQTTClient,
) *RecommendationProcessor {
	farmRepo := repository.NewFarmRepository(db)
	return NewRecommendationProcessor(
		repository.NewRecommendationRepository(db),
		repository.NewWeatherRepository(db),
		farmRepo,
		repository.NewUserRepository(db),
		clients.NewKijaniboxClient(cfg.KijaniBoxBaseURL, cfg.KijaniBoxAPIKey),
		clients.NewPythonAIClient(cfg.AIServiceURL),
		mqttClient,
		services.NewAlertService(
			repository.NewAlertRepository(db),
			asynqClient,
		),
	)
}

func (p *RecommendationProcessor) ProcessTask(ctx context.Context, _ *asynq.Task) error {
	farms, err := p.farmRepo.ListAllFarms(ctx)
	if err != nil {
		slog.Error("failed to list farms for recommendation generation",
			slog.String("error", err.Error()))
		return err
	}

	if len(farms) == 0 {
		slog.Info("no farms to generate recommendations for")
		return nil
	}

	slog.Info("generating recommendations", slog.Int("farm_count", len(farms)))
	for _, farm := range farms {
		rec, err := p.service.GenerateRecommendation(ctx, farm.ID)
		if err != nil {
			// Log and continue; one farm's upstream failure should not block
			// the rest of the batch. Retry happens on the next scheduled run.
			slog.Error("recommendation generation failed for farm",
				slog.String("farm_id", farm.ID),
				slog.String("error", err.Error()))
			continue
		}
		slog.Info("recommendation generated",
			slog.String("farm_id", farm.ID),
			slog.String("action", rec.Action))
	}

	return nil
}