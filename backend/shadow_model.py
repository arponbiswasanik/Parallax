import uvicorn
from fastapi import FastAPI
import numpy as np

app = FastAPI(title="Shadow Model")

@app.post("/predict")
async def predict(payload: dict):
    probs = np.random.dirichlet(np.array([0.5, 2.0, 0.5])).tolist()
    return {
        "model": "shadow-v2",
        "probabilities": probs,
        "prediction": int(np.argmax(probs))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)