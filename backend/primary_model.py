import uvicorn
from fastapi import FastAPI
import numpy as np
import joblib

app = FastAPI(title="Primary Model - Random Forest")

model = joblib.load("models/primary_model.joblib")
scaler = joblib.load("models/scaler.joblib")

@app.post("/predict")
async def predict(payload: dict):
    features = np.array([[
        payload["amount"],
        payload["oldbalanceOrg"],
        payload["newbalanceOrig"],
        payload["oldbalanceDest"],
        payload["newbalanceDest"]
    ]])
    features_scaled = scaler.transform(features)
    probs = model.predict_proba(features_scaled)[0].tolist()
    return {
        "model": "primary-v1-random-forest",
        "probabilities": probs,
        "prediction": int(np.argmax(probs))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)