import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_semantic_drift(primary_response: str, shadow_response: str) -> dict:
    vectorizer = TfidfVectorizer()
    
    try:
        tfidf_matrix = vectorizer.fit_transform([primary_response, shadow_response])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        drift_score = 1 - float(similarity)
    except Exception:
        drift_score = 1.0
        similarity = 0.0

    return {
        "cosine_similarity": float(similarity),
        "semantic_drift_score": drift_score,
        "primary_response_length": len(primary_response),
        "shadow_response_length": len(shadow_response)
    }