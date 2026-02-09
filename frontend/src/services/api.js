import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== LOCATIONS API =====
export const getLocations = () => api.get("/locations");
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const createLocation = (data) => api.post("/locations", data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

// ===== CHECKPOINTS API =====
export const getCheckpoints = () => api.get("/checkpoints");
export const getCheckpointById = (id) => api.get(`/checkpoints/${id}`);
export const createCheckpoint = (data) => api.post("/checkpoints", data);
export const updateCheckpoint = (id, data) => api.put(`/checkpoints/${id}`, data);
export const deleteCheckpoint = (id) => api.delete(`/checkpoints/${id}`);

export default api;
