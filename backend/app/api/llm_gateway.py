import asyncio
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from groq import Groq
from app.drift.llm_calculator import calculate_semantic_drift
from app.core.config import settings
from app.core.database import AsyncSessionLocal, LLMDriftLog
from datetime import datetime

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class LLMRequest(BaseModel):
    prompt: str

def get_llm_response(model: str, prompt: str) -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    return response.choices[0].message.content

async def run_llm_shadow(prompt: str, primary_response: str):
    try:
        shadow_response = await asyncio.to_thread(
            get_llm_response, settings.SHADOW_LLM_MODEL, prompt
        )
        drift_scores = calculate_semantic_drift(primary_response, shadow_response)
        is_drifted = "YES" if drift_scores["semantic_drift_score"] > settings.DRIFT_THRESHOLD else "NO"

        async with AsyncSessionLocal() as session:
            log = LLMDriftLog(
                timestamp=datetime.utcnow(),
                prompt=prompt,
                primary_model=settings.PRIMARY_LLM_MODEL,
                shadow_model=settings.SHADOW_LLM_MODEL,
                primary_response=primary_response,
                shadow_response=shadow_response,
                cosine_similarity=drift_scores["cosine_similarity"],
                semantic_drift_score=drift_scores["semantic_drift_score"],
                is_drifted=is_drifted
            )
            session.add(log)
            await session.commit()
            print(f"[LLM DRIFT SAVED] Semantic Drift: {drift_scores['semantic_drift_score']:.4f} | Drifted: {is_drifted}")

    except Exception as e:
        print(f"[LLM SHADOW ERROR] {e}")

@router.post("/llm-predict")
async def llm_predict(request: LLMRequest, background_tasks: BackgroundTasks):
    primary_response = await asyncio.to_thread(
        get_llm_response, settings.PRIMARY_LLM_MODEL, request.prompt
    )
    background_tasks.add_task(run_llm_shadow, request.prompt, primary_response)
    return {
        "model": settings.PRIMARY_LLM_MODEL,
        "prompt": request.prompt,
        "response": primary_response
    }