# AMATSI Backend

Go backend API for AMATSI, the smart-irrigation platform for smallholder farmers.
Built with [Gin](https://gin-gonic.com/), [pgx](https://github.com/jackc/pgx),
and [Asynq](https://github.com/hibiken/asynq).

## Deployed service

- Production API: https://amatsi.onrender.com/api
- Health check: https://amatsi.onrender.com/health

## Local environment setup

Render provides the production environment variables. For local development,
copy the safe template and fill in credentials from your own development
accounts:

```bash
cp .env.example .env
```

Do not commit `backend/.env`. It contains secrets and is intentionally ignored.

`REDIS_URL` accepts either `redis://` for local Redis or `rediss://` for hosted
Redis such as Upstash. The Asynq client and worker use TLS automatically for
`rediss://` URLs.

## Run locally

```bash
go run ./cmd/server/main.go
```

Requires a reachable PostgreSQL (`SUPABASE_DB_URL`), Redis (`REDIS_URL`), and a
`JWT_SECRET`. The AI service (`AI_SERVICE_URL`) is needed for recommendation
generation.

## Environment variables

| Variable                  | Required | Description                                          |
|---------------------------|----------|------------------------------------------------------|
| `PORT`                    | no       | HTTP port (Render injects it at runtime)             |
| `GIN_MODE`                | no       | `release` in production                              |
| `ALLOWED_ORIGINS`         | yes      | Comma-separated CORS origins (no spaces after commas)|
| `SUPABASE_DB_URL`         | yes      | PostgreSQL connection string (Supabase-hosted)       |
| `JWT_SECRET`              | yes      | Signing key for auth tokens                          |
| `REDIS_URL`               | yes      | `redis://` or `rediss://` (used for cache + Asynq)   |
| `AI_SERVICE_URL`          | yes      | Python recommendation service base URL               |
| `KIJANIBOX_API_KEY`       | yes      | KijaniBox satellite weather/soil API key             |
| `KIJANIBOX_BASE_URL`      | yes      | e.g. `https://api.kijanispace.eu`                    |
| `AFRICA_TALKING_API_KEY`  | yes      | SMS gateway key                                      |
| `AFRICA_TALKING_USERNAME` | yes      | `sandbox` locally, real username in production       |
| `AFRICA_TALKING_SENDER_ID`| yes      | `AMATSI`                                             |

## API endpoints

All `/api` routes except signup/login require a Bearer JWT.

| Method | Path                            | Description                                   |
|--------|---------------------------------|-----------------------------------------------|
| POST   | `/api/auth/signup`              | Register with phone + password                |
| POST   | `/api/auth/login`               | Returns JWT + user profile                    |
| POST   | `/api/auth/logout`              | Invalidates the token                         |
| PUT    | `/api/auth/profile`             | Update name/phone/email/language/SMS prefs    |
| POST   | `/api/auth/change-password`     | Change password (bcrypt verify, strict limit) |
| GET    | `/api/farms`                    | List current user's farms                     |
| POST   | `/api/farms`                    | Create a farm                                 |
| GET    | `/api/farms/:id`                | Get one farm                                  |
| PUT    | `/api/farms/:id`                | Update a farm                                 |
| DELETE | `/api/farms/:id`                | Delete a farm                                 |
| GET    | `/api/weather/:farmId`          | Weather for a farm (KijaniBox, cached 1h)     |
| GET    | `/api/soil/:farmId`             | Soil moisture for a farm                      |
| GET    | `/api/recommendations/:farmId`  | Latest stored recommendation                  |
| POST   | `/api/recommendations/generate` | Generate recommendation via AI service        |
| GET    | `/api/alerts/history`           | Auto-sent SMS alert history                   |

All password/reset-style and SMS endpoints are rate-limited via Redis
(`RateLimitFromEnv` for general, `StrictRateLimitFromEnv` for
send/generate/change-password).

## Migrations

Run the numbered SQL files under `backend/migrations/` in order against the
database. They are idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`), so
re-running them is safe.

## Architecture notes

- **Auth**: self-managed bcrypt + golang-jwt. Supabase is used purely as hosted
  PostgreSQL — Supabase Auth is not used.
- **Queue**: SMS and background jobs go through Redis/Asynq (`internal/queue`),
  so the API never blocks on third-party SMS latency.
- **Clients**: `internal/clients/` wraps KijaniBox (weather/soil),
  Africa's Talking (SMS), and the Python AI service.
- **Recommendations**: the AI service is treated as an upstream dependency; the
  backend persists each recommendation and queues an SMS when the action is
  `IRRIGATE` (`internal/services/recommendation_service.go`).

## Security model (important — read this)

**Why RLS is not the enforcement layer.** The backend connects to Supabase with
a service-role connection string (`SUPABASE_DB_URL`), which the Postgres server
treats as table owner / superuser. **Row Level Security is bypassed for every
query the Go API runs.** In practice this is the intended design: access control
happens in Go, not the database —

1. JWTs are self-issued and verified by `JWTAuthMiddleware`.
2. Every handler checks ownership in Go before returning data, e.g. farms are
   looked up with `GetFarmByID` then compared to the caller's `userID`, and the
   phone repository scopes every query: `DELETE ... WHERE id = $1 AND user_id = $2`.

**What the `CREATE POLICY ... USING (auth.uid() = id)` lines are for.** These are
inert for the Go backend (Supabase populates `auth.uid()` from PostgREST JWTs,
which we never issue). They are kept on every table as a dormant safety net: the
schema stays correct if Supabase's PostgREST API
(`<project>.supabase.co/rest/v1/*`) is ever exposed publicly with the **anon
key**, which is what RLS actually protects against.

**The real exposure and how it's closed.** Supabase grants the `anon` and
`authenticated` roles access to the `public` schema by default, and its
`ALTER DEFAULT PRIVILEGES` grants new tables to those roles too. Without RLS, a
leaked anon key would let anyone read/write **any** table through PostgREST.
Since the Go API is the only legitimate client, migration `012_lockdown_postgrest.sql`
revokes schema + table + sequence + function privileges from `anon` and
`authenticated`, so PostgREST cannot reach the tables at all. Reset by re-granting:

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
```

**Convention for new tables.** Always include the RLS block (enable RLS +
`DROP POLICY IF EXISTS` + `CREATE POLICY`) from a migration like `011_create_user_phones.sql`,
even though it does not protect the Go API. It keeps the schema PostgREST-safe
if the lockdown is ever reverted, and it documents intent.