from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import Column, Integer, Float, DateTime, String, Text
from datetime import datetime
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://"
)

engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    connect_args={"statement_cache_size": 0}
)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

class DriftLog(Base):
    __tablename__ = "drift_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    kl_divergence = Column(Float)
    js_divergence = Column(Float)
    ks_statistic = Column(Float)
    primary_prediction = Column(Integer)
    shadow_prediction = Column(Integer)
    is_drifted = Column(String)

class LLMDriftLog(Base):
    __tablename__ = "llm_drift_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    prompt = Column(Text)
    primary_model = Column(String)
    shadow_model = Column(String)
    primary_response = Column(Text)
    shadow_response = Column(Text)
    cosine_similarity = Column(Float)
    semantic_drift_score = Column(Float)
    is_drifted = Column(String)

class RegressionDriftLog(Base):
    __tablename__ = "regression_drift_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    hour = Column(Integer)
    day_of_week = Column(Integer)
    month = Column(Integer)
    day_of_year = Column(Integer)
    is_weekend = Column(Integer)
    primary_prediction = Column(Float)
    shadow_prediction = Column(Float)
    absolute_difference = Column(Float)
    percentage_difference = Column(Float)
    wasserstein_distance = Column(Float)
    is_drifted = Column(String)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)