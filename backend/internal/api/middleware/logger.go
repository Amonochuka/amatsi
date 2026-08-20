/*
 * ============================================================================
 * internal/api/middleware/logger.go — REQUEST LOGGER MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Logs every HTTP request so the team can debug, audit SMS sends, and spot
 * failing upstream calls (Feature 19.12 API Logging).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wrap the handler to log a single line per request: timestamp, method,
 *   path, status code, latency/duration, client IP, user ID (when authed).
 * - Use a structured logger (std log/slog or a small helper) so logs are
 *   parseable by Railway log viewer.
 * - Never log request bodies that may contain passwords, JWTs, or SMS
 *   message content — log only metadata (Feature 19.7 safety).
 * - Ensure the logger runs before recovery/panic middleware errors so
 *   failures are still captured.
 *
 * Feature references: 19.12, 19.7.
 * ============================================================================
 */