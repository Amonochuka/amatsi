# AMATSI

Smart irrigation and water management for smallholder farmers.

Farmers register their farms (crop, soil, irrigation method, tank capacity, and
location), and AMATSI combines satellite weather and soil data from KijaniBox
with a deterministic rule engine to recommend whether to **irrigate now, wait
for rain, monitor, or conserve water**. Recommendations and important alerts are
delivered by SMS through Africa's Talking.

## How it works

```
Frontend (Next.js)  →  Go Backend API  →  KijaniBox (weather & soil)
        │                  │  │              │
        │                  │  └──→  Python AI service (/predict rule engine)
        │                  │
        │                  └──→  Redis (Asynq queue) →  Africa's Talking (SMS)
        │
        └── PostgreSQL (Supabase-hosted) stores users, farms, weather, recommendations & alerts
```

1. A farmer signs up with a phone number and password, then registers a farm.
2. The farm's location is picked on the map (OpenStreetMap search or device GPS)
   — no GPS coordinates are ever typed by hand.
3. The backend fetches weather and soil moisture for the farm's coordinates from
   KijaniBox and caches the result in Redis for an hour.
4. The Python AI service scores the current conditions with a transparent,
   deterministic rule engine and returns one recommendation
   (`IRRIGATE`, `WAIT`, `MONITOR`, or `CONSERVE`) with a water volume estimate.
5. The recommendation is stored and shown in the dashboard; when the action is
   `IRRIGATE`, an SMS alert is sent to the farmer via Africa's Talking
   (queued on Redis/Asynq so the API never blocks on SMS).

> **Note:** Recommendations are advisory, threshold-based guidance — not a
> trained ML model. KijaniBox soil moisture is a satellite estimate, not a
> physical sensor. There is currently no live tank-level telemetry; tank levels
> come from farmer-entered capacity and honest empty states.

## Deployed services

| Service       | URL                                       | Purpose                          |
|---------------|-------------------------------------------|----------------------------------|
| Frontend      | https://amatsi.vercel.app                 | Next.js app (Vercel)             |
| Backend API   | https://amatsi.onrender.com/api            | Go/Gin REST API (Render)         |
| Backend health| https://amatsi.onrender.com/health         | Health check                    |
| AI service    | https://amatsi-ai.onrender.com             | Python/FastAPI recommendations  |
| AI health     | https://amatsi-ai.onrender.com/health      | Health check                    |
| PostgreSQL    | Supabase-hosted (private)                 | Primary data store               |
| Redis         | Upstash-hosted (private)                  | Cache + Asynq job queue          |

## Repo layout

```
├── backend/      Go backend API (Gin, pgx, Asynq) — see backend/README.md
├── frontend/     Next.js frontend — see frontend/README.md
├── ai-service/   Python recommendation service (FastAPI) — see ai-service/INTEGRATION.md
├── docs/         Project documentation
└── docker-compose.yml   Local full-stack development
```

## Local full-stack development

Run the frontend, Go API, AI service, PostgreSQL, Redis, and MQTT broker with
Docker Compose:

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- API health: http://localhost:8080/health
- AI health: http://localhost:8000/health

The Compose setup uses a seeded local PostgreSQL database and deterministic mock
KijaniBox data; it does not send SMS or use production API credentials.

To reset the local database and seed data:

```bash
docker compose down -v
```

## Architecture decisions

- **Auth** is self-managed in the Go backend (bcrypt + JWT). Supabase is used
  only as a hosted PostgreSQL connection; Supabase Auth is not used.
- **Kijani satellite data**: weather and soil moisture come from KijaniBox
  `GetLandForecast(farm.lat, farm.lon)`, cached in Redis for 1h.
- **SMS**: Africa's Talking in sandbox mode locally; sender ID `AMATSI` in
  production. Alerts are generated automatically when a recommendation action is
  `IRRIGATE` (see `recommendation_service.go`).
- **Rate limiting**: login/signup use a moderate Redis-backed limiter; SMS
  sending and recommendation generation use a stricter one.
- **Nil safety**: list endpoints return `[]` (not `null`) so the frontend never
  crashes on missing data.