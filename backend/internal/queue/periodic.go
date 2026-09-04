package queue

import "github.com/hibiken/asynq"

// DailyRecommendationsProvider schedules the periodic "generate recommendations
// for all farms" task according to a cron spec (default "0 6 * * *", i.e. daily
// at 06:00 UTC). It is wrapped in a small struct so multiple schedules can be
// registered later without changing the periodic task manager wiring.
type DailyRecommendationsProvider struct {
	cronspec string
}

func NewDailyRecommendationsProvider(cronspec string) *DailyRecommendationsProvider {
	return &DailyRecommendationsProvider{cronspec: cronspec}
}

func (p *DailyRecommendationsProvider) GetConfigs() ([]*asynq.PeriodicTaskConfig, error) {
	return []*asynq.PeriodicTaskConfig{
		{
			Cronspec: p.cronspec,
			Task:     NewGenerateRecommendationsTask(),
		},
	}, nil
}