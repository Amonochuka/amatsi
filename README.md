# AMATSI
# Local full-stack development

Run the frontend, Go API, AI service, PostgreSQL, Redis, and MQTT broker with
Docker Compose:

```bash
cp .env.example .env
docker compose up --build
```

The frontend is available at http://localhost:3000, the API health check at
http://localhost:8080/health, and the AI health check at
http://localhost:8000/health. The Compose setup uses a seeded local PostgreSQL
database and deterministic mock KijaniBox data; it does not send SMS or use
production API credentials.

To reset the local database and seed data, run:

```bash
docker compose down -v
```
