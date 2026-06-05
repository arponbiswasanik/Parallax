import numpy as np
from scipy.stats import wasserstein_distance

def calculate_regression_drift(primary_pred: float, shadow_pred: float) -> dict:
    diff = abs(primary_pred - shadow_pred)
    pct_diff = diff / (abs(primary_pred) + 1e-10) * 100

    p = np.array([primary_pred])
    q = np.array([shadow_pred])
    w_distance = float(wasserstein_distance(p, q))

    return {
        "primary_prediction": primary_pred,
        "shadow_prediction": shadow_pred,
        "absolute_difference": float(diff),
        "percentage_difference": float(pct_diff),
        "wasserstein_distance": w_distance
    }