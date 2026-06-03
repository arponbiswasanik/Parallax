from fastapi import FastAPI
from app.api.gateway import router

app = FastAPI(
    title="Parallax",
    description="A model-agnostic shadow deployment framework for real-time concept drift detection",
    version="0.1.0"
)

app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}