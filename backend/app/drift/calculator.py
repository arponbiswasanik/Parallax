import numpy as np
from scipy.spatial.distance import jensenshannon
from scipy.stats import ks_2samp

def calculate_kl_divergence(p: list[float], q: list[float]) -> float:
    p = np.array(p) + 1e-10
    q = np.array(q) + 1e-10
    p = p / p.sum()
    q = q / q.sum()
    return float(np.sum(p * np.log(p / q)))

def calculate_js_divergence(p: list[float], q: list[float]) -> float:
    p = np.array(p) + 1e-10
    q = np.array(q) + 1e-10
    p = p / p.sum()
    q = q / q.sum()
    return float(jensenshannon(p, q))

def calculate_ks_statistic(p: list[float], q: list[float]) -> float:
    statistic, _ = ks_2samp(p, q)
    return float(statistic)

def calculate_drift(primary_probs: list[float], shadow_probs: list[float]) -> dict:
    return {
        "kl_divergence": calculate_kl_divergence(primary_probs, shadow_probs),
        "js_divergence": calculate_js_divergence(primary_probs, shadow_probs),
        "ks_statistic": calculate_ks_statistic(primary_probs, shadow_probs),
    }