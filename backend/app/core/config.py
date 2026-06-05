from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PRIMARY_MODEL_URL: str
    SHADOW_MODEL_URL: str
    DRIFT_THRESHOLD: float = 0.1
    APP_ENV: str = "development"
    DATABASE_URL: str
    GROQ_API_KEY: str
    PRIMARY_LLM_MODEL: str = "llama-3.1-8b-instant"
    SHADOW_LLM_MODEL: str = "llama-3.3-70b-versatile"

    class Config:
        env_file = ".env"

settings = Settings()