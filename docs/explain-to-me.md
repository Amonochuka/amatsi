# AMATSI — Explain-To-Me Doc (READ AND DELETE)

This doc explains (in plain language) how the scheduled daily recommendation run
works and every file it touched. Read it, ask me anything that's still unclear,
then delete it — the real Docs live in the READMEs.

---

## 1. THE BIG PICTURE — what happens every day at 06:00 UTC

```
06:00 (cron fires)
   │
   ▼
Asynq PeriodicTaskManager creates the task "recommendations:generate-all"
   │
   ▼
Redis queue stores the task
   │
   ▼
Asynq Worker (running inside the same Go process) picks it up
   │
   ▼
RecommendationProcessor.ProcessTask runs
   │
   ├─> farmRepo.ListAllFarms()  ──  SELECT * FROM farms (ALL farmers' farms)
   │
   └─ for EACH farm:
        │
        ├─> kijani.GetLandForecast(lat, lon)         (weather + soil from KijaniBox)
        ├─> INSERT INTO weather                        (saves the snapshot)
        ├─> POST AI_SERVICE_URL/predict                (the "AI" rule engine)
        ├─> INSERT INTO recommendations               (saves action/reason/water saved)
        │
        └─ IF action == "IRRIGATE":
              ├─ Premium + has device + MQTT → pump trigger via MQTT
              └─ otherwise                    → SMS to the farmer
```

That's it. The scheduled run is just an **automatic version of the exact same
thing the `/recommendations/generate` HTTP button does manually** — it reuses
the same `RecommendationService.GenerateRecommendation`.

---

## 2. FILES CREATED

### `backend/internal/queue/periodic.go` — NEW
A tiny object that tells Asynq "run this task on this schedule".

- Holds a cron string like `"0 6 * * *"` (means: at minute 0, hour 6, every day).
- `GetConfigs()` returns a `PeriodicTaskConfig` combining:
  - the cron schedule, and
  - the task to run (`NewGenerateRecommendationsTask()`).
- Why a struct instead of just a function? Asynq's PeriodicTaskManager calls a
  provider's `GetConfigs` repeatedly (every `SyncInterval`) to keep the schedule
  in sync, so it needs something it can call multiple times.

### `backend/internal/queue/workers/recommendation_worker.go` — NEW
The part that actually does the work when the task fires.

- `RecommendationProcessor` wraps a `RecommendationService` (same service the
  HTTP endpoint uses — no duplicated logic).
- `ProcessTask(ctx, task)`:
  1. `ListAllFarms()` → get every farm in the DB.
  2. Loop over farms. For each one → `service.GenerateRecommendation(farmID)`.
  3. If a single farm fails (e.g. Kijani is down), **log it and continue** —
     one bad farm must not block the rest. Next day's run will retry it.
  4. Returns nil = task succeeded (even if some farms failed).
- There is **no JWT involved**. A login token is an HTTP-transport thing; this
  runs server-side with no logged-in user, so it calls the service function
  directly.

---

## 3. FILES CHANGED

### `backend/internal/queue/tasks.go`
- Added a new task **type** constant: `TypeGenerateRecommendations = "recommendations:generate-all"`.
  Think of it as the "name" of the job in the Redis queue.
- Added `NewGenerateRecommendationsTask()` — creates an `asynq.Task` with an
  empty `{}` payload. (The worker doesn't need any input; it reads the farm list
  from the DB itself.) Task is assigned to the `low` queue so it never competes
  with SMS traffic.

### `backend/internal/repository/farm_repository.go`
- Added `ListAllFarms(ctx)` — a new SQL query: `SELECT ... FROM farms ORDER BY
  created_at`.
- Key difference from existing `GetFarmsByFarmer`: that one filters
  `WHERE user_id = $1` (one farmer's farms). This one has **no filter** — it
  returns every farm from every user, which is what the background worker needs.

### `backend/internal/config/config.go`
- Added `RecommendationCron string` field.
- Reads `RECOMMENDATION_CRON` env var, defaults to `"0 6 * * *"` (06:00 UTC).
- **You can change the schedule without redeploying code** — just set
  `RECOMMENDATION_CRON` in Render's env vars. (Needs a redeploy to apply, since
  Render rebuilds env changes.)

### `backend/cmd/server/main.go`
Two additions, both inside the existing `if asynqServer != nil` block:

1. **Register the worker handler**:
   `mux.HandleFunc(queue.TypeGenerateRecommendations, recProcessor.ProcessTask)`
   — tells Asynq "when you see this task type, run this function".

2. **Start the scheduler** in a goroutine:
   - Build the `PeriodicTaskManager` with the Redis connection and the
     `NewDailyRecommendationsProvider(cfg.RecommendationCron)`.
   - `periodicMgr.Start()` — begins polling the provider and creating tasks on
     schedule.
   - If Redis parsing fails, it logs and exits the goroutine (API still runs;
     you just don't get auto-recommendations).

Also: a new `slog.Warn` when MQTT broker isn't configured, so the logs state
plainly that auto-irrigation is off but SMS still works.

---

## 4. WHY ASYNQ PERIODIC TASKS (instead of Go's built-in `time.Ticker`)

| Approach | What it does | Problem |
|---|---|---|
| `time.Ticker` in a goroutine | Sleep until 6am, run | If the process restarts at 5:59am, the 6am run is **lost**. Multiple instances (if you ever scale) would **double-run** it. |
| Asynq PeriodicTaskManager (chosen) | Cron lives in Redis, task goes into the queue, any worker instance can claim it | Survives restarts (task just queues late). Exactly-once-ish execution. Fits the queue infra you already have for SMS. |

That's why this slots into your existing Asynq setup rather than a naive timer.

---

## 5. WHY RECOMMENDATION_CRON IS CONFIGURABLE

Hardcoding `"0 6 * * *"` would force a deploys to change the schedule. Making it
an env var means you can:
- Run it morning vs. evening per regional preference.
- Disable auto-run by setting it to something absurd like
  `"0 0 30 2 *"` (Feb 30 — never fires).
- Tune after you see real usage.

Worth noting: the cron is **UTC**. For East Africa (EAT = UTC+3), `0 6 * * *`
UTC = **9am local**. If you want it at 6am local, use `"0 3 * * *"`.

---

## 6. WHAT DOES *NOT* HAPPEN (read this so you're not surprised)

- **No duplicate SMS spam**: `SMS enrollment` only fires inside the IRRIGATE
  branch, same as manual. The daily run just makes it automatic.
- **No tank-level telemetry yet**: the AI request still sends
  `TankCapacityLiters` (capacity, not live level). Live tank levels are the
  MQTT/telemetry work we flagged separately.
- **Depends on downtime**: if Kijani or the AI service is down at 6am, that
  farm's recommendation just doesn't happen that day (logged, retried next day).
  There's no backfill in this version.
- **Free tier still gets SMS-free guides? No.** Free users get an SMS only on
  IRRIGATE verdicts, exactly like a manual `generate` click today.

---

## 7. PREMIUM — SEPARATE TOPIC, SAME DOC

- `is_premium` is a real boolean on the `users` table (migration
  `007_add_premium_tier.sql`).
- It flips a real behavior in the IRRIGATE branch (SMS vs MQTT auto-pump).
- **What's missing is the upgrade path**: no payment (M-Pesa/Stripe), no admin
  endpoint, no billing. The Settings "Upgrade to Premium" button is therefore
  dead.
- Fix options (ask me to build whichever you pick):
  A. Honest button → mailto support link (fastest, no backend work).
  B. Admin/manual grant endpoint (tiny backend work).
  C. Real M-Pesa (Daraja) integration (big: needs sandbox creds + password).

---

## 8. THINGS THAT ARE STILL FAKE / IDLE (separate from the scheduler)

Seen in Settings and the header; user asked what's idle:
- Header 🔔 bell — no handler (pure decoration).
- "Upgrade to Premium" — no handler (see section 7).
- "Recommendations left today 3/5", "SMS credits remaining 38" — hardcoded
  numbers, not from the backend.
- "Add phone / Remove phone" (SMS recipients) — only local React state, never
  saved to the backend (the backend has no multi-phone feature).
- "Theme (Light/Dark/Auto)" — selects nothing, no theme is applied.
- "Auto-sync when back online" — no backing logic.

The alerts page itself is honest (real status + real SMS history from the DB).

---

## 9. THE DATABASE POOL (`dbpool`) — "I don't get that too"

Every DB query in the app goes through ONE shared object called `dbPool` — a
PostgreSQL **connection pool**.

### The problem it solves
Opening a database connection is expensive (network handshake, auth, sometimes
encryption). Doing it **per request** is slow. Doing it per query is madness.
A pool is a **growable bucket of already-open connections** that requests borrow
and return.

```
request 1 ─┐
request 2 ─┼─> borrow a connection ──> run query ──> return it to pool
request 3 ─┘        (from the bucket)                (don't close!)
```

### Where it's created
`backend/internal/clients/supabase.go` → `NewSupabasePool(connString)`:
- `MaxConns = 10` — at most 10 connections open at once. Why? Supabase free/paid
  tiers cap total connections; staying under the cap avoids "too many connections"
  errors.
- `MinConns = 2` — keep 2 always warm so the first request isn't slow.
- `MaxConnLifetime = 1h` — close and replace connections older than 1h (Postgres /
  Supabase may recycle them; this avoids stale-connection errors).
- `MaxConnIdleTime = 30m` — close idle ones after 30min to save resources.
- Builds the pool, **pings** it to confirm the DB is reachable, else fails fast.

### How it flows through the app
1. `main.go` creates it once at startup: `dbPool, _ := clients.NewSupabasePool(...)`.
2. `router.Use(injectDeps(...))` puts it on the **request context**:
   `c.Set("db_pool", dbPool)`.
3. Every handler pulls it out: `db := c.MustGet("db_pool").(*pgxpool.Pool)`.
4. Repositories get it via `repository.NewXxxRepository(db)` and run queries.

### Why a pool instead of one connection
- **Concurrency**: many users hit the API at once; one connection serializes them.
- **Failover**: if Supabase drops a connection, pgx silently replaces it.
- **Performance**: reuse is far cheaper than reconnect-per-request.

---

## 10. RLS & THE SECURITY MODEL — "so my RLS does nothing???"

Short answer: **for the Go backend, correct — it does nothing. That's by design.**

### Why
The backend connects with the **service-role / table-owner** connection string
(`SUPABASE_DB_URL`). Postgres treats that as privileged, so **Row Level Security
is bypassed** for every query Go runs. Supabase's `auth.uid()` is only populated
by PostgREST (their auto REST API) from JWT headers — we never send Supabase
JWTs (we make our own in Go).

### So what actually protects the data?
Go, not the DB:
1. JWT middleware validates the token on every `/api/*` request.
2. Handlers check ownership line-by-line, e.g. `farm.UserID != userID → 404`,
   and repositories scope queries: `DELETE ... WHERE id=$1 AND user_id=$2`.

### Then why keep `CREATE POLICY ... USING (auth.uid() = id)` on every table?
A **dormant safety net**. If Supabase's PostgREST API
(`<project>.supabase.co/rest/v1/*`) were ever exposed with the default **anon
key**, RLS is the thing that gates tables. With policies present, a leaked anon
key still can't read another farmer's rows. Without them, new tables are open to
anyone.

### The real gap and the fix (migration 012)
Supabase grants `anon`/`authenticated` roles broad access to `public.*` and
`ALTER DEFAULT PRIVILEGES` gives new tables to them too. Since the Go API is the
only client, `012_lockdown_postgrest.sql` **revokes** schema/table/sequence/function
access from `anon` and `authenticated`, closing PostgREST entirely. RLS then
becomes pure future-proofing.

**Convention**: new tables still ship with the RLS block (enable RLS + policy)
so the schema stays PostgREST-safe if the lockdown is ever reverted.