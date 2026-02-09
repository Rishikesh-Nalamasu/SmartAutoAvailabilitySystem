import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import LocationCard from "../../components/LocationCard/LocationCard";
import AddLocationForm from "./AddLocationForm";
import PolygonMap from "./PolygonMap";
import "./Locations.css";

export default function Locations() {
  const { locations, loading, error, addLocation, removeLocation } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    locationDescription: "",
    geofencePoints: [],
    uiCoordinates: [],
  });

  const handlePointsChange = (points) => {
    setFormData(prev => ({
      ...prev,
      geofencePoints: points,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    
    if (!formData.locationName || !formData.locationDescription || formData.geofencePoints.length === 0) {
      alert("Please fill in all fields and add at least one geofence point");
      return;
    }

    try {
      await addLocation(formData);
      setShowForm(false);
      setFormData({
        locationName: "",
        locationDescription: "",
        geofencePoints: [],
        uiCoordinates: [],
      });
    } catch (err) {
      console.error("Error adding location:", err);
    }
  };

  const handleDelete = async (locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await removeLocation(locationId);
      } catch (err) {
        console.error("Error deleting location:", err);
      }
    }
  };

  return (
    <div className="locations-container">
      <div className="locations-header">
        <h1>📍 Locations Management</h1>
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Hide Form" : "+ Add Location"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-section">
          <form onSubmit={handleAddLocation} className="add-location-form">
            <h2>➕ Add New Location</h2>
            
            <div className="form-group">
              <label htmlFor="locationName">Location Name *</label>
              <input
                type="text"
                id="locationName"
                name="locationName"
                value={formData.locationName}
                onChange={handleInputChange}
                placeholder="e.g., Downtown Area"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="locationDescription">Description *</label>
              <textarea
                id="locationDescription"
                name="locationDescription"
                value={formData.locationDescription}
                onChange={handleInputChange}
                placeholder="Describe this location..."
                rows="3"
                required
              />
            </div>

            <div className="form-info">
              <p>📌 <strong>Geofence Points:</strong> Use the map below to draw the polygon and add points</p>
              <p><strong>Current Points:</strong> {formData.geofencePoints.length}</p>
            </div>

            <button
              type="submit"
              disabled={loading || formData.geofencePoints.length === 0}
              className="submit-btn"
            >
              {loading ? "Creating..." : "Create Location"}
            </button>
          </form>
          
          <PolygonMap onPointsChange={handlePointsChange} />
        </div>
      )}

      <div className="locations-list">
        {loading ? (
          <div className="loading">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="no-data">No locations yet. Add one to get started!</div>
        ) : (
          <>
            <h2>Total Locations: {locations.length}</h2>
            {locations.map(location => (
              <LocationCard
                key={location.location_id}
                location={location}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
