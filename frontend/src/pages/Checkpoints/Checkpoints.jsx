import { useContext, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { AppContext } from "../../context/AppContext";
import CheckpointCard from "../../components/CheckpointCard/CheckpointCard";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Checkpoints.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icon for new checkpoint
const newMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fit map bounds to checkpoints
function FitBounds({ checkpoints }) {
  const map = useMap();
  
  useEffect(() => {
    if (checkpoints.length > 0) {
      const points = checkpoints.map(cp => [Number(cp.latitude), Number(cp.longitude)]);
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [checkpoints, map]);
  
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick, isSelecting }) {
  useMapEvents({
    click: (e) => {
      if (isSelecting) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

export default function Checkpoints() {
  const { checkpoints, loading, error, addCheckpoint, editCheckpoint, removeCheckpoint } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const [formData, setFormData] = useState({
    checkpointName: "",
    sequenceOrder: "",
    latitude: "",
    longitude: "",
    mobileX: "",
    mobileY: "",
    laptopX: "",
    laptopY: "",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      checkpointName: "",
      sequenceOrder: "",
      latitude: "",
      longitude: "",
      mobileX: "",
      mobileY: "",
      laptopX: "",
      laptopY: "",
    });
    setSelectedPoint(null);
    setEditingCheckpoint(null);
    setIsSelecting(false);
  };

  // Handle map click
  const handleMapClick = (latlng) => {
    setSelectedPoint(latlng);
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    }));
  };

  // Handle edit click
  const handleEdit = (checkpoint) => {
    setEditingCheckpoint(checkpoint);
    setShowForm(true);
    setIsSelecting(false);
    
    const mobileCoord = checkpoint.ui_coordinates?.find(c => c.device_type === "mobile");
    const laptopCoord = checkpoint.ui_coordinates?.find(c => c.device_type === "laptop");
    
    setFormData({
      checkpointName: checkpoint.checkpoint_name,
      sequenceOrder: checkpoint.sequence_order?.toString() || "",
      latitude: Number(checkpoint.latitude).toFixed(6),
      longitude: Number(checkpoint.longitude).toFixed(6),
      mobileX: mobileCoord?.x_coordinate?.toString() || "",
      mobileY: mobileCoord?.y_coordinate?.toString() || "",
      laptopX: laptopCoord?.x_coordinate?.toString() || "",
      laptopY: laptopCoord?.y_coordinate?.toString() || "",
    });
    
    setSelectedPoint({ lat: Number(checkpoint.latitude), lng: Number(checkpoint.longitude) });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this checkpoint?")) {
      await removeCheckpoint(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      alert("Please select a point on the map or enter coordinates");
      return;
    }

    const uiCoordinates = [];
    if (formData.mobileX && formData.mobileY) {
      uiCoordinates.push({
        device_type: "mobile",
        x_coordinate: parseFloat(formData.mobileX),
        y_coordinate: parseFloat(formData.mobileY)
      });
    }
    if (formData.laptopX && formData.laptopY) {
      uiCoordinates.push({
        device_type: "laptop",
        x_coordinate: parseFloat(formData.laptopX),
        y_coordinate: parseFloat(formData.laptopY)
      });
    }

    const data = {
      checkpointName: formData.checkpointName,
      sequenceOrder: parseInt(formData.sequenceOrder) || 1,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      uiCoordinates
    };

    try {
      if (editingCheckpoint) {
        await editCheckpoint(editingCheckpoint.checkpoint_id, data);
      } else {
        await addCheckpoint(data);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving checkpoint:", err);
    }
  };

  return (
    <div className="checkpoints-page">
      <div className="page-header">
        <h1>🚩 Checkpoints</h1>
        <button 
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "✕ Cancel" : "+ Add Checkpoint"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Map showing all checkpoints */}
      <div className="map-section">
        <h2>🗺️ Checkpoints Map</h2>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="checkpoints-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds checkpoints={checkpoints} />
          <MapClickHandler onMapClick={handleMapClick} isSelecting={isSelecting} />
          
          {/* Show existing checkpoints */}
          {checkpoints.map(checkpoint => (
            <Marker
              key={checkpoint.checkpoint_id}
              position={[Number(checkpoint.latitude), Number(checkpoint.longitude)]}
            >
              <Popup>
                <strong>{checkpoint.checkpoint_name}</strong><br />
                Sequence: {checkpoint.sequence_order}
              </Popup>
            </Marker>
          ))}

          {/* Show selected new point */}
          {isSelecting && selectedPoint && (
            <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={newMarkerIcon}>
              <Popup>New checkpoint location</Popup>
            </Marker>
          )}
        </MapContainer>
        
        {showForm && !editingCheckpoint && (
          <button 
            className={`select-point-btn ${isSelecting ? 'selecting' : ''}`}
            onClick={() => setIsSelecting(!isSelecting)}
          >
            {isSelecting ? "📍 Click on map to select point..." : "🎯 Select Point on Map"}
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-section">
          <h2>{editingCheckpoint ? "✏️ Edit Checkpoint" : "➕ Add New Checkpoint"}</h2>
          
          <form onSubmit={handleSubmit} className="checkpoint-form">
            <div className="form-row">
              <div className="form-group">
                <label>Checkpoint Name *</label>
                <input
                  type="text"
                  value={formData.checkpointName}
                  onChange={(e) => setFormData({ ...formData, checkpointName: e.target.value })}
                  placeholder="Enter checkpoint name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sequence Order *</label>
                <input
                  type="number"
                  value={formData.sequenceOrder}
                  onChange={(e) => setFormData({ ...formData, sequenceOrder: e.target.value })}
                  placeholder="Order"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="coords-section">
              <h3>🌍 GPS Coordinates</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude *</label>
                  <input
                    type="number"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g., 28.6139"
                    step="0.000001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Longitude *</label>
                  <input
                    type="number"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g., 77.2090"
                    step="0.000001"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="ui-coords-section">
              <h3>📱 UI Coordinates</h3>
              
              <div className="coord-row">
                <span className="device-label">Mobile:</span>
                <input
                  type="number"
                  placeholder="X"
                  value={formData.mobileX}
                  onChange={(e) => setFormData({ ...formData, mobileX: e.target.value })}
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Y"
                  value={formData.mobileY}
                  onChange={(e) => setFormData({ ...formData, mobileY: e.target.value })}
                  step="0.01"
                />
              </div>

              <div className="coord-row">
                <span className="device-label">Laptop:</span>
                <input
                  type="number"
                  placeholder="X"
                  value={formData.laptopX}
                  onChange={(e) => setFormData({ ...formData, laptopX: e.target.value })}
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Y"
                  value={formData.laptopY}
                  onChange={(e) => setFormData({ ...formData, laptopY: e.target.value })}
                  step="0.01"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : editingCheckpoint ? "Update Checkpoint" : "Create Checkpoint"}
            </button>
          </form>
        </div>
      )}

      {/* Checkpoints List */}
      <div className="checkpoints-list">
        <h2>📋 All Checkpoints ({checkpoints.length})</h2>
        {loading && <div className="loading">Loading...</div>}
        {!loading && checkpoints.length === 0 && (
          <div className="no-data">No checkpoints yet. Add one to get started!</div>
        )}
        <div className="cards-grid">
          {checkpoints.map(checkpoint => (
            <CheckpointCard
              key={checkpoint.checkpoint_id}
              checkpoint={checkpoint}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
