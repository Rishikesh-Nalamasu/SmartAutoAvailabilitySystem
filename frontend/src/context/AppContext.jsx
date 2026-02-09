import { createContext, useState, useEffect } from "react";
import {
  getLocations,
  getCheckpoints,
  createLocation as apiCreateLocation,
  createCheckpoint as apiCreateCheckpoint,
  updateLocation as apiUpdateLocation,
  updateCheckpoint as apiUpdateCheckpoint,
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
      setError(err.response?.data?.message || "Failed to fetch locations");
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
      setError(err.response?.data?.message || "Failed to fetch checkpoints");
      console.error("Error fetching checkpoints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add location
  const addLocation = async (data) => {
    setError(null);
    try {
      await apiCreateLocation(data);
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create location");
      throw err;
    }
  };

  // Edit location
  const editLocation = async (id, data) => {
    setError(null);
    try {
      await apiUpdateLocation(id, data);
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update location");
      throw err;
    }
  };

  // Delete location
  const removeLocation = async (id) => {
    setError(null);
    try {
      await apiDeleteLocation(id);
      await fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete location");
      throw err;
    }
  };

  // Add checkpoint
  const addCheckpoint = async (data) => {
    setError(null);
    try {
      await apiCreateCheckpoint(data);
      await fetchCheckpoints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create checkpoint");
      throw err;
    }
  };

  // Edit checkpoint
  const editCheckpoint = async (id, data) => {
    setError(null);
    try {
      await apiUpdateCheckpoint(id, data);
      await fetchCheckpoints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update checkpoint");
      throw err;
    }
  };

  // Delete checkpoint
  const removeCheckpoint = async (id) => {
    setError(null);
    try {
      await apiDeleteCheckpoint(id);
      await fetchCheckpoints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete checkpoint");
      throw err;
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchCheckpoints();
  }, []);

  return (
    <AppContext.Provider value={{
      locations,
      checkpoints,
      loading,
      error,
      fetchLocations,
      fetchCheckpoints,
      addLocation,
      editLocation,
      removeLocation,
      addCheckpoint,
      editCheckpoint,
      removeCheckpoint,
    }}>
      {children}
    </AppContext.Provider>
  );
};
