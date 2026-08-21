"""FastAPI dependencies for external integrations."""

import os

from app.clients.kijanibox_client import DEFAULT_TIMEOUT_SECONDS, KijaniboxClient
from app.clients.mock_data import MockKijaniboxClient


def get_kijanibox_client() -> KijaniboxClient | MockKijaniboxClient | None:
    """Build the configured KijaniBox client, or None when not configured.

    Set ``KIJANIBOX_USE_MOCK=true`` to serve deterministic fixtures without
    network access (offline demos and tests).
    """
    if os.getenv("KIJANIBOX_USE_MOCK", "").strip().lower() in {"1", "true", "yes"}:
        return MockKijaniboxClient(
            scenario=os.getenv("KIJANIBOX_MOCK_SCENARIO", "normal").strip().lower()
        )

    base_url = os.getenv("KIJANIBOX_BASE_URL", "").strip()
    api_key = os.getenv("KIJANIBOX_API_KEY", "").strip()
    if not base_url or not api_key:
        return None

    timeout = float(os.getenv("KIJANIBOX_TIMEOUT_SECONDS", str(DEFAULT_TIMEOUT_SECONDS)))
    return KijaniboxClient(base_url=base_url, api_key=api_key, timeout_seconds=timeout)
