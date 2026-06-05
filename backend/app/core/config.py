from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PRIMARY_MODEL_URL: str
    SHADOW_MODEL_URL: str
    DRIFT_THRESHOLD: float = 0.1
    APP_ENV: str = "development"
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()