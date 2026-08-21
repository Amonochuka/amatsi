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
