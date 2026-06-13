import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default function PredictForm() {
  const [form, setForm] = useState({
    distance_km: "",
    weather: "Clear",
    traffic_level: "Medium",
    preparation_time_min: "",
    time_of_day: "Morning",
    vehicle_type: "Scooter",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
  ...form,
  distance_km:          parseFloat(parseFloat(form.distance_km).toFixed(2)),
  preparation_time_min: parseInt(form.preparation_time_min),
};
      const res = await axios.post(`${API_URL}/predict`, payload);
      setResult(res.data);
    } catch (err) {
      setError("Prediction failed. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>🛵 Delivery Time Predictor</h1>

      <form onSubmit={handleSubmit}>
        <label>Distance (km)</label>
        <input 
  type="number" 
  name="distance_km" 
  step="0.1"      
  min="0.1"       
  max="20"        
  required
  value={form.distance_km} 
  onChange={handleChange} 
  style={inputStyle}
/>

        <label>Weather</label>
        <select name="weather" value={form.weather} onChange={handleChange} style={inputStyle}>
          {["Clear","Windy","Foggy","Rainy","Snowy"].map(w => <option key={w}>{w}</option>)}
        </select>

        <label>Traffic Level</label>
        <select name="traffic_level" value={form.traffic_level} onChange={handleChange} style={inputStyle}>
          {["Low","Medium","High"].map(t => <option key={t}>{t}</option>)}
        </select>

        <label>Time of Day</label>
        <select name="time_of_day" value={form.time_of_day} onChange={handleChange} style={inputStyle}>
          {["Morning","Afternoon","Evening","Night"].map(t => <option key={t}>{t}</option>)}
        </select>

        <label>Vehicle Type</label>
        <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange} style={inputStyle}>
          {["Scooter","Bike","Car"].map(v => <option key={v}>{v}</option>)}
        </select>

        <label>Preparation Time (min)</label>
        <input type="number" name="preparation_time_min" required
          value={form.preparation_time_min} onChange={handleChange} style={inputStyle}/>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Predicting..." : "Predict Delivery Time"}
        </button>
      </form>

      {result && (
        <div style={resultStyle}>
          <h2>⏱ {result.estimated_delivery_minutes} minutes</h2>
          <p>Expected range: {result.confidence_range}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", marginBottom: 16,
  padding: "10px 12px", fontSize: 15, borderRadius: 8,
  border: "1px solid #ccc", boxSizing: "border-box"
};
const btnStyle = {
  width: "100%", padding: "12px", fontSize: 16,
  background: "#4F46E5", color: "#fff", border: "none",
  borderRadius: 8, cursor: "pointer"
};
const resultStyle = {
  marginTop: 24, padding: 20, background: "#F0FDF4",
  borderRadius: 8, border: "1px solid #86EFAC", textAlign: "center"
};