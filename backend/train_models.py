import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import joblib
import os

# Load data
print("[INFO] Loading dataset...")
df = pd.read_csv("data/transactions.csv")

# Preprocess
print("[INFO] Preprocessing...")
df = df[['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest', 'isFraud']]
df = df.dropna()

X = df.drop('isFraud', axis=1)
y = df['isFraud']

# Undersample majority class
fraud = df[df['isFraud'] == 1]
non_fraud = df[df['isFraud'] == 0].sample(n=len(fraud) * 10, random_state=42)
df_balanced = pd.concat([fraud, non_fraud])

X = df_balanced.drop('isFraud', axis=1)
y = df_balanced['isFraud']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train Primary Model - Random Forest
print("[INFO] Training Primary Model (Random Forest)...")
primary_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
primary_model.fit(X_train, y_train)
print("[PRIMARY]")
print(classification_report(y_test, primary_model.predict(X_test)))

# Train Shadow Model - Logistic Regression
print("[INFO] Training Shadow Model (Logistic Regression)...")
shadow_model = LogisticRegression(random_state=42, max_iter=1000)
shadow_model.fit(X_train, y_train)
print("[SHADOW]")
print(classification_report(y_test, shadow_model.predict(X_test)))

# Save models
os.makedirs("models", exist_ok=True)
joblib.dump(primary_model, "models/primary_model.joblib")
joblib.dump(shadow_model, "models/shadow_model.joblib")
joblib.dump(scaler, "models/scaler.joblib")
print("[INFO] Models saved to /models")