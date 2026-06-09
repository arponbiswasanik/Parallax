import httpx
import asyncio
import random

BASE_URL = "http://localhost:8000/api/v1"

async def test_classification():
    print("[INFO] Testing Classification endpoint...")
    async with httpx.AsyncClient() as client:
        for i in range(50):
            payload = {
                "amount": random.uniform(100, 50000),
                "oldbalanceOrg": random.uniform(0, 100000),
                "newbalanceOrig": random.uniform(0, 100000),
                "oldbalanceDest": random.uniform(0, 50000),
                "newbalanceDest": random.uniform(0, 50000),
            }
            response = await client.post(f"{BASE_URL}/predict", json=payload, timeout=30)
            print(f"[CLASS {i+1}/50] {response.json().get('prediction')}")
            await asyncio.sleep(0.3)

async def test_llm():
    print("[INFO] Testing LLM endpoint...")
    prompts = [
        "What is concept drift in machine learning?",
        "Explain shadow deployment in production systems.",
        "How does fraud detection work in mobile banking?",
        "What are the risks of deploying a new ML model?",
        "Describe the difference between KL divergence and JS divergence.",
        "What is Wasserstein distance used for?",
        "How do you monitor model performance in production?",
        "Explain the importance of A/B testing in ML systems.",
        "What is data drift vs concept drift?",
        "How does TF-IDF work for text similarity?",
    ]
    async with httpx.AsyncClient() as client:
        for i in range(50):
            payload = {"prompt": prompts[i % len(prompts)]}
            response = await client.post(f"{BASE_URL}/llm-predict", json=payload, timeout=60)
            print(f"[LLM {i+1}/50] done")
            await asyncio.sleep(1.0)

async def test_regression():
    print("[INFO] Testing Regression endpoint...")
    async with httpx.AsyncClient() as client:
        for i in range(50):
            payload = {
                "hour": random.randint(0, 23),
                "day_of_week": random.randint(0, 6),
                "month": random.randint(1, 12),
                "day_of_year": random.randint(1, 365),
                "is_weekend": random.randint(0, 1),
            }
            response = await client.post(f"{BASE_URL}/regression-predict", json=payload, timeout=30)
            print(f"[REG {i+1}/50] {response.json().get('prediction_mw', ''):.2f} MW")
            await asyncio.sleep(0.3)

async def main():
    await test_classification()
    await test_llm()
    await test_regression()
    print("[DONE] All 50x3 tests completed!")

asyncio.run(main())