import joblib
import numpy as np
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.drift.regression_calculator import calculate_regression_drift
from app.core.config import settings
from app.core.database import AsyncSessionLocal, RegressionDriftLog
from datetime import datetime

router = APIRouter()

primary_model = joblib.load("models/primary_regression_model.joblib")
shadow_model = joblib.load("models/shadow_regression_model.joblib")
scaler = joblib.load("models/regression_scaler.joblib")

class RegressionRequest(BaseModel):
    hour: int
    day_of_week: int
    month: int
    day_of_year: int
    is_weekend: int

async def run_regression_shadow(payload: RegressionRequest, primary_pred: float):
    try:
        features = np.array([[
            payload.hour,
            payload.day_of_week,
            payload.month,
            payload.day_of_year,
            payload.is_weekend
        ]])
        features_scaled = scaler.transform(features)
        shadow_pred = float(shadow_model.predict(features_scaled)[0])
        drift_scores = calculate_regression_drift(primary_pred, shadow_pred)
        is_drifted = "YES" if drift_scores["wasserstein_distance"] > settings.DRIFT_THRESHOLD else "NO"

        async with AsyncSessionLocal() as session:
            log = RegressionDriftLog(
                timestamp=datetime.utcnow(),
                hour=payload.hour,
                day_of_week=payload.day_of_week,
                month=payload.month,
                day_of_year=payload.day_of_year,
                is_weekend=payload.is_weekend,
                primary_prediction=primary_pred,
                shadow_prediction=shadow_pred,
                absolute_difference=drift_scores["absolute_difference"],
                percentage_difference=drift_scores["percentage_difference"],
                wasserstein_distance=drift_scores["wasserstein_distance"],
                is_drifted=is_drifted
            )
            session.add(log)
            await session.commit()
            print(f"[REGRESSION DRIFT SAVED] Wasserstein: {drift_scores['wasserstein_distance']:.4f} | Drifted: {is_drifted}")

    except Exception as e:
        print(f"[REGRESSION SHADOW ERROR] {e}")

@router.post("/regression-predict")
async def regression_predict(payload: RegressionRequest, background_tasks: BackgroundTasks):
    features = np.array([[
        payload.hour,
        payload.day_of_week,
        payload.month,
        payload.day_of_year,
        payload.is_weekend
    ]])
    features_scaled = scaler.transform(features)
    primary_pred = float(primary_model.predict(features_scaled)[0])
    background_tasks.add_task(run_regression_shadow, payload, primary_pred)
    return {
        "model": "primary-random-forest-regressor",
        "prediction_mw": primary_pred,
        "features": payload.model_dump()
    }