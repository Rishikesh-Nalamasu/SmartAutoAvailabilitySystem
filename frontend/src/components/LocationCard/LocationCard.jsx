import "./LocationCard.css";

export default function LocationCard({ location, onEdit, onDelete }) {
  const geofencePoints = location.geofence_points?.filter(p => p !== null) || [];
  const uiCoords = location.ui_coordinates?.filter(c => c !== null) || [];
  
  const mobileCoord = uiCoords.find(c => c.device_type === "mobile");
  const laptopCoord = uiCoords.find(c => c.device_type === "laptop");

  return (
    <div className="location-card">
      <div className="card-header">
        <h3>{location.location_name}</h3>
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(location)}>✎</button>
          <button className="delete-btn" onClick={() => onDelete(location.location_id)}>✕</button>
        </div>
      </div>
      
      <p className="description">{location.location_description}</p>
      
      <div className="card-info">
        <div className="info-row">
          <span className="label">Geofence Points:</span>
          <span className="value">{geofencePoints.length}</span>
        </div>
        
        <div className="ui-coords">
          <h4>📱 UI Coordinates</h4>
          <div className="coords-grid">
            <div className="coord-item">
              <span className="device">Mobile:</span>
              {mobileCoord ? (
                <span>X: {Number(mobileCoord.x_coordinate).toFixed(2)}, Y: {Number(mobileCoord.y_coordinate).toFixed(2)}</span>
              ) : (
                <span className="not-set">Not set</span>
              )}
            </div>
            <div className="coord-item">
              <span className="device">Laptop:</span>
              {laptopCoord ? (
                <span>X: {Number(laptopCoord.x_coordinate).toFixed(2)}, Y: {Number(laptopCoord.y_coordinate).toFixed(2)}</span>
              ) : (
                <span className="not-set">Not set</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
