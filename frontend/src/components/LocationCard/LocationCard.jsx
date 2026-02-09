import "./LocationCard.css";

export default function LocationCard({ location, onDelete }) {
  const geofencePoints = location.geofence_points?.filter(p => p !== null) || [];
  const uiCoordinates = location.ui_coordinates?.filter(c => c !== null) || [];

  return (
    <div className="location-card">
      <div className="card-header">
        <h2>{location.location_name}</h2>
        <button 
          className="delete-btn"
          onClick={() => onDelete(location.location_id)}
          title="Delete location"
        >
          ✕
        </button>
      </div>
      
      <p className="card-description">{location.location_description}</p>

      <div className="card-section">
        <h3>📍 Geofence Points ({geofencePoints.length})</h3>
        {geofencePoints.length > 0 ? (
          <ul className="points-list">
            {geofencePoints.map((point, idx) => (
              <li key={point.point_id || idx}>
                Lat: {point.latitude.toFixed(6)}, Lng: {point.longitude.toFixed(6)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No geofence points</p>
        )}
      </div>

      <div className="card-section">
        <h3>📱 UI Coordinates ({uiCoordinates.length})</h3>
        {uiCoordinates.length > 0 ? (
          <ul className="coordinates-list">
            {uiCoordinates.map((coord) => (
              <li key={coord.ui_coord_id}>
                {coord.device_type}: X={coord.x_coordinate}, Y={coord.y_coordinate}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No UI coordinates</p>
        )}
      </div>
    </div>
  );
}
