import { createContext, useState, useEffect } from "react";
import {
  getLocations,
  getCheckpoints,
  createLocation as apiCreateLocation,
  createCheckpoint as apiCreateCheckpoint,
  deleteLocation as apiDeleteLocation,
  deleteCheckpoint as apiDeleteCheckpoint,
} from "../services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all locations
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLocations();
      setLocations(response.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch locations");
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all checkpoints
  const fetchCheckpoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCheckpoints();
      setCheckpoints(response.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch checkpoints");
      console.error("Error fetching checkpoints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new location
  const addLocation = async (locationData) => {
    setError(null);
    try {
      const response = await apiCreateLocation(locationData);
      await fetchLocations();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create location";
      setError(errorMsg);
      throw err;
    }
  };

  // Add new checkpoint
  const addCheckpoint = async (checkpointData) => {
    setError(null);
    try {
      const response = await apiCreateCheckpoint(checkpointData);
      await fetchCheckpoints();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create checkpoint";
      setError(errorMsg);
      throw err;
    }
  };

  // Delete location
  const removeLocation = async (locationId) => {
    setError(null);
    try {
      await apiDeleteLocation(locationId);
      await fetchLocations();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete location";
      setError(errorMsg);
      throw err;
    }
  };

  // Delete checkpoint
  const removeCheckpoint = async (checkpointId) => {
    setError(null);
    try {
      await apiDeleteCheckpoint(checkpointId);
      await fetchCheckpoints();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete checkpoint";
      setError(errorMsg);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchLocations();
    fetchCheckpoints();
  }, []);

  const value = {
    locations,
    checkpoints,
    loading,
    error,
    fetchLocations,
    fetchCheckpoints,
    addLocation,
    addCheckpoint,
    removeLocation,
    removeCheckpoint,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
