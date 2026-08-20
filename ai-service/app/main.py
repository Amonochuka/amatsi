# ============================================================================
# app/main.py — FASTAPI APPLICATION ENTRY POINT
# Component: Person D (AI & Integration Specialist)
#
# Bootstraps the FastAPI app for the AI recommendation service: wires up CORS,
# exposes the GET /health liveness probe, and mounts the prediction router that
# serves farmer recommendations.
#
# WHAT NEEDS TO BE DONE:
# - Instantiate FastAPI app (e.g. FastAPI(title="KijaniFarmer AI Service", version="0.1.0")).
# - Add CORS middleware so the frontend (Next.js) and backend (Go) can call this
#   service from their origins (read allowed origins from .env).
# - Define GET /health returning {"status": "ok"} for Docker healthchecks
#   (see Dockerfile / docker-compose.yml).
# - Import and include the prediction router from app/routes/predict.py (prefix,
#   e.g. "/api/v1" or as wired by the Go backend).
# - Load environment variables via python-dotenv (.env at ai-service root).
# - Root route (optional) that lists available endpoints for debugging.
# - TODO(Person D): feature 19.7 — catch startup errors and log clearly.
#
# Feature references: 6.2 (rule engine), 19.7 (error handling), 19.9 (rate limiting/timeouts)
# ============================================================================