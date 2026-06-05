import httpx
from fastapi import APIRouter, BackgroundTasks
from app.drift.calculator import calculate_drift
from app.core.config import settings
from app.core.database import AsyncSessionLocal, DriftLog
from datetime import datetime

router = APIRouter()

async def run_shadow(payload: dict, primary_probs: list[float], primary_prediction: int):
    try:
        async with httpx.AsyncClient() as client:
            shadow_response = await client.post(
                f"{settings.SHADOW_MODEL_URL}/predict",
                json=payload,
                timeout=10.0
            )
            shadow_data = shadow_response.json()
            shadow_probs = shadow_data.get("probabilities", [])
            shadow_prediction = shadow_data.get("prediction", -1)
            drift_scores = calculate_drift(primary_probs, shadow_probs)

            is_drifted = "YES" if drift_scores["kl_divergence"] > settings.DRIFT_THRESHOLD else "NO"

            async with AsyncSessionLocal() as session:
                log = DriftLog(
                    timestamp=datetime.utcnow(),
                    kl_divergence=drift_scores["kl_divergence"],
                    js_divergence=drift_scores["js_divergence"],
                    ks_statistic=drift_scores["ks_statistic"],
                    primary_prediction=primary_prediction,
                    shadow_prediction=shadow_prediction,
                    is_drifted=is_drifted
                )
                session.add(log)
                await session.commit()
                print(f"[DRIFT SAVED] {drift_scores} | Drifted: {is_drifted}")

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
        primary_prediction = primary_data.get("prediction", -1)
        background_tasks.add_task(run_shadow, payload, primary_probs, primary_prediction)
        return primary_data