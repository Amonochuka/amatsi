package queue

import (
	"github.com/hibiken/asynq"
)

type QueueManager struct {
	Client *asynq.Client
	Server *asynq.Server
	Mux    *asynq.ServeMux
}

func NewQueueManager(redisAddr string) *QueueManager {
	redisConnOpt := asynq.RedisClientOpt{Addr: redisAddr}
	
	client := asynq.NewClient(redisConnOpt)
	
	server := asynq.NewServer(
		redisConnOpt,
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"low":      1,
			},
		},
	)
	
	mux := asynq.NewServeMux()

	return &QueueManager{
		Client: client,
		Server: server,
		Mux:    mux,
	}
}

func (qm *QueueManager) Start() error {
	return qm.Server.Start(qm.Mux)
}

func (qm *QueueManager) Stop() {
	qm.Client.Close()
	qm.Server.Stop()
}
