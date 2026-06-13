from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, json, numpy as np, pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scaler    = joblib.load("delivery_scaler.pkl")
model     = joblib.load("delivery_model.pkl")
feat_cols = json.load(open("feature_columns.json"))

WEATHER_MAP     = {"Windy":0, "Clear":1, "Foggy":2, "Rainy":3, "Snowy":4}
TRAFFIC_MAP     = {"Low":0, "Medium":1, "High":2, "Unknown":3}
TIME_MAP        = {"Afternoon":0, "Evening":1, "Morning":2, "Night":3, "Unknown":4}
VEHICLE_MAP     = {"Scooter":0, "Bike":1, "Car":2}

class OrderInput(BaseModel):
    distance_km: float
    weather: str
    traffic_level: str
    preparation_time_min: int
    time_of_day: str
    vehicle_type: str

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(order: OrderInput):
    w = WEATHER_MAP[order.weather]
    t = TRAFFIC_MAP[order.traffic_level]
    tod = TIME_MAP[order.time_of_day]
    v = VEHICLE_MAP[order.vehicle_type]

    row = {
        "Distance_km":          order.distance_km,
        "Weather":              w,
        "Traffic_Level":        t,
        "Time_of_Day":          tod,
        "Vehicle_Type":         v,
        "Preparation_Time_min": order.preparation_time_min,
        "distance_sq":          order.distance_km ** 2,
        "dist_x_prep":          order.distance_km * order.preparation_time_min,
        "traffic_x_dist":       t * order.distance_km,
    }

    df_row = pd.DataFrame([row])[feat_cols]
    scaled = scaler.transform(df_row)
    pred   = model.predict(scaled)[0]

    return {
        "estimated_delivery_minutes": round(float(pred), 1),
        "confidence_range": f"{max(0, round(float(pred)-7))}-{round(float(pred)+7)} min"
    }