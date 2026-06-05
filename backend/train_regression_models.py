import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

# Load data
print("[INFO] Loading dataset...")
df = pd.read_csv("data/energy.csv")
df.columns = ["datetime", "energy_mw"]
df["datetime"] = pd.to_datetime(df["datetime"])

# Feature engineering
print("[INFO] Creating features...")
df["hour"] = df["datetime"].dt.hour
df["day_of_week"] = df["datetime"].dt.dayofweek
df["month"] = df["datetime"].dt.month
df["day_of_year"] = df["datetime"].dt.dayofyear
df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

df = df.dropna()
df = df.sample(n=50000, random_state=42)

X = df[["hour", "day_of_week", "month", "day_of_year", "is_weekend"]]
y = df["energy_mw"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Primary Model - Random Forest Regressor
print("[INFO] Training Primary Model (Random Forest Regressor)...")
primary_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
primary_model.fit(X_train_scaled, y_train)
y_pred = primary_model.predict(X_test_scaled)
print(f"[PRIMARY] MAE: {mean_absolute_error(y_test, y_pred):.2f} | R2: {r2_score(y_test, y_pred):.4f}")

# Train Shadow Model - Linear Regression
print("[INFO] Training Shadow Model (Linear Regression)...")
shadow_model = LinearRegression()
shadow_model.fit(X_train_scaled, y_train)
y_pred_shadow = shadow_model.predict(X_test_scaled)
print(f"[SHADOW] MAE: {mean_absolute_error(y_test, y_pred_shadow):.2f} | R2: {r2_score(y_test, y_pred_shadow):.4f}")

# Save models
os.makedirs("models", exist_ok=True)
joblib.dump(primary_model, "models/primary_regression_model.joblib")
joblib.dump(shadow_model, "models/shadow_regression_model.joblib")
joblib.dump(scaler, "models/regression_scaler.joblib")
print("[INFO] Regression models saved to /models")