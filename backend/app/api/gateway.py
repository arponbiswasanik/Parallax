import httpx
from fastapi import APIRouter, BackgroundTasks
from app.drift.calculator import calculate_drift
from app.core.config import settings

router = APIRouter()

async def run_shadow(payload: dict, primary_probs: list[float]):
    try:
        async with httpx.AsyncClient() as client:
            shadow_response = await client.post(
                f"{settings.SHADOW_MODEL_URL}/predict",
                json=payload,
                timeout=10.0
            )
            shadow_probs = shadow_response.json().get("probabilities", [])
            drift_scores = calculate_drift(primary_probs, shadow_probs)
            print(f"[DRIFT] {drift_scores}")
    except Exception as e:
        print(f"[SHADOW ERROR] {e}")

@router.post("/predict")
async def predict(payload: dict, background_tasks: BackgroundTasks):
    async with httpx.AsyncClient() as client:
        primary_response = await client.post(
            f"{settings.PRIMARY_MODEL_URL}/predict",
            json=payload,
            timeout=10.0
        )
        primary_data = primary_response.json()
        primary_probs = primary_data.get("probabilities", [])
        background_tasks.add_task(run_shadow, payload, primary_probs)
        return primary_data