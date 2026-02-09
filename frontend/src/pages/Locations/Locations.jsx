import { useContext, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup, Polygon, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { AppContext } from "../../context/AppContext";
import LocationCard from "../../components/LocationCard/LocationCard";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./Locations.css";

// Component to fit map bounds to polygons
function FitBounds({ locations }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const allPoints = locations.flatMap(loc => 
        loc.geofence_points?.map(p => [p.latitude, p.longitude]) || []
      );
      if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [50, 50] });
      }
    }
  }, [locations, map]);
  
  return null;
}

export default function Locations() {
  const { locations, loading, error, addLocation, editLocation, removeLocation } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [drawnPolygon, setDrawnPolygon] = useState([]);
  const featureGroupRef = useRef(null);
  
  const [formData, setFormData] = useState({
    locationName: "",
    locationDescription: "",
    mobileX: "",
    mobileY: "",
    laptopX: "",
    laptopY: "",
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      locationName: "",
      locationDescription: "",
      mobileX: "",
      mobileY: "",
      laptopX: "",
      laptopY: "",
    });
    setDrawnPolygon([]);
    setEditingLocation(null);
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
  };

  // Handle edit click
  const handleEdit = (location) => {
    setEditingLocation(location);
    setShowForm(true);
    
    const mobileCoord = location.ui_coordinates?.find(c => c.device_type === "mobile");
    const laptopCoord = location.ui_coordinates?.find(c => c.device_type === "laptop");
    
    setFormData({
      locationName: location.location_name,
      locationDescription: location.location_description,
      mobileX: mobileCoord?.x_coordinate?.toString() || "",
      mobileY: mobileCoord?.y_coordinate?.toString() || "",
      laptopX: laptopCoord?.x_coordinate?.toString() || "",
      laptopY: laptopCoord?.y_coordinate?.toString() || "",
    });
    
    setDrawnPolygon(location.geofence_points || []);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await removeLocation(id);
    }
  };

  // Handle polygon drawn
  const onCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    const points = latlngs.map(latlng => ({
      latitude: latlng.lat,
      longitude: latlng.lng
    }));
    setDrawnPolygon(points);
  };

  // Handle polygon deleted
  const onDeleted = () => {
    setDrawnPolygon([]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (drawnPolygon.length < 3) {
      alert("Please draw a polygon with at least 3 points on the map");
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
      locationName: formData.locationName,
      locationDescription: formData.locationDescription,
      geofencePoints: drawnPolygon,
      uiCoordinates
    };

    try {
      if (editingLocation) {
        await editLocation(editingLocation.location_id, data);
      } else {
        await addLocation(data);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving location:", err);
    }
  };

  return (
    <div className="locations-page">
      <div className="page-header">
        <h1>📍 Locations</h1>
        <button 
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "✕ Cancel" : "+ Add Location"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Map showing all locations */}
      <div className="map-section">
        <h2>🗺️ Locations Map</h2>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="locations-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds locations={locations} />
          
          {/* Show existing locations as polygons */}
          {locations.map(location => {
            const points = location.geofence_points?.filter(p => p !== null) || [];
            if (points.length >= 3) {
              return (
                <Polygon
                  key={location.location_id}
                  positions={points.map(p => [p.latitude, p.longitude])}
                  pathOptions={{ color: '#667eea', fillColor: '#667eea', fillOpacity: 0.3 }}
                />
              );
            }
            return null;
          })}
        </MapContainer>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-section">
          <h2>{editingLocation ? "✏️ Edit Location" : "➕ Add New Location"}</h2>
          
          {/* Drawing Map */}
          <div className="draw-map-container">
            <p className="map-instruction">Draw a polygon on the map to define the geofence area:</p>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="draw-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FeatureGroup ref={featureGroupRef}>
                <EditControl
                  position="topright"
                  onCreated={onCreated}
                  onDeleted={onDeleted}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    polygon: {
                      allowIntersection: false,
                      shapeOptions: { color: '#667eea' }
                    }
                  }}
                />
              </FeatureGroup>
              
              {/* Show drawn polygon */}
              {drawnPolygon.length >= 3 && (
                <Polygon
                  positions={drawnPolygon.map(p => [p.latitude, p.longitude])}
                  pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.3 }}
                />
              )}
            </MapContainer>
            <p className="points-count">Points drawn: {drawnPolygon.length}</p>
          </div>

          <form onSubmit={handleSubmit} className="location-form">
            <div className="form-group">
              <label>Location Name *</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="Enter location name"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.locationDescription}
                onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                placeholder="Enter description"
                rows="3"
                required
              />
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
              {loading ? "Saving..." : editingLocation ? "Update Location" : "Create Location"}
            </button>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="locations-list">
        <h2>📋 All Locations ({locations.length})</h2>
        {loading && <div className="loading">Loading...</div>}
        {!loading && locations.length === 0 && (
          <div className="no-data">No locations yet. Add one to get started!</div>
        )}
        <div className="cards-grid">
          {locations.map(location => (
            <LocationCard
              key={location.location_id}
              location={location}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
