import { useState } from "react";

export default function AddCheckpointForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    checkpointName: "",
    latitude: "",
    longitude: "",
    sequenceOrder: "",
    uiCoordinates: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "sequenceOrder" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.checkpointName || !formData.latitude || !formData.longitude || formData.sequenceOrder === "") {
      alert("Please fill in all required fields");
      return;
    }

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert("Latitude and Longitude must be valid numbers");
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      alert("Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        checkpointName: formData.checkpointName,
        latitude,
        longitude,
        sequenceOrder: formData.sequenceOrder,
        uiCoordinates: formData.uiCoordinates,
      });

      setFormData({
        checkpointName: "",
        latitude: "",
        longitude: "",
        sequenceOrder: "",
        uiCoordinates: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-checkpoint-form">
      <h2>➕ Add New Checkpoint</h2>

      <div className="form-group">
        <label htmlFor="checkpointName">Checkpoint Name *</label>
        <input
          type="text"
          id="checkpointName"
          name="checkpointName"
          value={formData.checkpointName}
          onChange={handleInputChange}
          placeholder="e.g., Entrance Gate"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Latitude *</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="e.g., 28.6139"
            step="0.000001"
            min="-90"
            max="90"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude *</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="e.g., 77.2090"
            step="0.000001"
            min="-180"
            max="180"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="sequenceOrder">Sequence Order *</label>
        <input
          type="number"
          id="sequenceOrder"
          name="sequenceOrder"
          value={formData.sequenceOrder}
          onChange={handleInputChange}
          placeholder="e.g., 1"
          min="0"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting || loading}
        className="submit-btn"
      >
        {submitting ? "Creating..." : "Create Checkpoint"}
      </button>
    </form>
  );
}
