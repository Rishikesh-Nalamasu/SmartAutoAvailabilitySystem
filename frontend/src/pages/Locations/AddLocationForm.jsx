import { useState } from "react";

export default function AddLocationForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    locationName: "",
    locationDescription: "",
    geofencePoints: [],
    uiCoordinates: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationName || !formData.locationDescription || formData.geofencePoints.length === 0) {
      alert("Please fill in all fields and add at least one geofence point");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        locationName: "",
        locationDescription: "",
        geofencePoints: [],
        uiCoordinates: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-location-form">
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
        disabled={submitting || loading || formData.geofencePoints.length === 0}
        className="submit-btn"
      >
        {submitting ? "Creating..." : "Create Location"}
      </button>
    </form>
  );
}
