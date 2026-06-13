🛵 Food Delivery Time Predictor

A full-stack machine learning application that predicts food delivery time based on distance, weather, traffic, and other factors.

Live Demo: your-app.vercel.app  |  API Docs: your-backend.onrender.com/docs


📊 Model Performance

MetricScoreR² Score0.772RMSE10.12 minMAE7.15 minAlgorithmXGBoost RegressorTraining Data1,000 orders


🔍 Key Findings (EDA)


Distance is the strongest predictor of delivery time (correlation: 0.78)
Preparation time has moderate impact (correlation: 0.31)
Courier experience has negligible effect (correlation: -0.089)
Feature engineering (dist_x_prep, traffic_x_dist) improved model performance significantly
Hyperparameters tuned using Optuna (50 trials, 5-fold cross-validation)



🛠️ Tech Stack

ML & Backend


Python, XGBoost, Scikit-learn, Pandas, NumPy
FastAPI, Uvicorn, Joblib
SHAP (model explainability)
Optuna (hyperparameter tuning)


Frontend


React, Vite, Axios


Deployment


Backend → Render
Frontend → Vercel
Version Control → GitHub



📁 Project Structure

food-delivery-predictor/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── delivery_model.pkl       # Trained XGBoost model
│   ├── delivery_scaler.pkl      # StandardScaler
│   ├── feature_columns.json     # Feature order for inference
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── PredictForm.jsx
├── Food_Delivery_Times.csv      # Dataset
├── timeprediction.ipynb         # Full EDA + model training notebook
└── README.md


🚀 Run Locally

Backend

bashcd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://127.0.0.1:8000
# Swagger UI at http://127.0.0.1:8000/docs

Frontend

bashcd frontend
npm install
npm run dev
# App running at http://localhost:5173


🔌 API Usage

POST /predict

json{
  "distance_km": 10.5,
  "weather": "Rainy",
  "traffic_level": "High",
  "time_of_day": "Evening",
  "vehicle_type": "Bike",
  "preparation_time_min": 20
}

Response

json{
  "estimated_delivery_minutes": 74.3,
  "confidence_range": "67-81 min"
}


📈 ML Pipeline


EDA — distribution analysis, correlation matrix, SHAP feature importance
Preprocessing — label encoding, median imputation, StandardScaler
Feature Engineering — dist_x_prep, distance_sq, traffic_x_dist
Training — XGBoost with early stopping
Tuning — Optuna (50 trials, 5-fold CV)
Evaluation — RMSE, MAE, R², residual plots, learning curves



👤 Author

Swarnendu Sahu

LinkedIn · GitHub