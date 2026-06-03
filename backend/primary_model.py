import uvicorn
from fastapi import FastAPI
import numpy as np

app = FastAPI(title="Primary Model")

@app.post("/predict")
async def predict(payload: dict):
    probs = np.random.dirichlet(np.ones(3)).tolist()
    return {
        "model": "primary-v1",
        "probabilities": probs,
        "prediction": int(np.argmax(probs))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)