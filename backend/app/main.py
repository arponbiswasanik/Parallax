from fastapi import FastAPI
from app.api.gateway import router
from app.api.llm_gateway import router as llm_router
from app.core.database import init_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("[INFO] Database initialized")
    yield

app = FastAPI(
    title="Parallax",
    description="A model-agnostic shadow deployment framework for real-time concept drift detection",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(router, prefix="/api/v1")
app.include_router(llm_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}