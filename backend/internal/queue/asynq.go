/*
 * ============================================================================
 * internal/queue/asynq.go — ASYNQ CLIENT + SERVER
 * Component: Person A or B + <Go API / Task Queue>
 *
 * Initialises the Asynq (Redis-backed) task queue used to decouple SMS
 * sending from the API request path.
 *
 * WHAT NEEDS TO BE DONE:
 * - NewClient(redisOpts): Asynq client used by handlers/services to enqueue
 *   SendSMSTask (Feature 13.1).
 * - NewServer(redisOpts): Asynq server with sensible concurrency, a
 *   max-retry policy (e.g. 3 attempts) and exponential backoff so failed
 *   SMS attempts are retried without hammering Africa's Talking
 *   (Features 13.8, 19.7).
 * - Register task handlers (the sms_worker) and Start/Shutdown integration
 *   wired from main.go.
 * - Reuse the shared Redis client config from internal/clients/redis.go.
 *
 * Feature references: 13.1, 13.8, 19.7.
 * ============================================================================
 */