/*
 * ============================================================================
 * internal/clients/redis.go — REDIS CLIENT
 * Component: Person B + <Database / Repos / Clients>
 *
 * Wraps go-redis for two jobs: caching weather/soil API responses
 * (TTL 1h) and serving as the Asynq task-queue broker.
 *
 * WHAT NEEDS TO BE DONE:
 * - Implement NewRedisClient(url) using github.com/redis/go-redis/v9,
 *   parsing the REDIS_URL (Upstash style redis://default:pass@host:port).
 * - Verify connectivity with a Ping on startup (Feature 19.7).
 * - Provide Close() for graceful shutdown.
 * - Return the client so both handlers (cache) and internal/queue
 *   (Asynq broker) can reuse the same connection.
 *
 * Feature references: 19.7.
 * ============================================================================
 */