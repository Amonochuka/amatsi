#
# Feature references: 6.2 (rule engine), 19.7 (error handling), 19.9 (rate limiting/timeouts)
# ============================================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predict import router as predict_router


app = FastAPI(title="KijaniFarmer AI Service", version="1.0.0")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["GET", "POST"],
	allow_headers=["*"],
)
app.include_router(predict_router)


@app.get("/health")
def health() -> dict[str, str]:
	return {"status": "ok"}