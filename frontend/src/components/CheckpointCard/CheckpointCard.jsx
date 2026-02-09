import "./CheckpointCard.css";

export default function CheckpointCard({ checkpoint, onEdit, onDelete }) {
  const uiCoords = checkpoint.ui_coordinates?.filter(c => c !== null) || [];
  
  const mobileCoord = uiCoords.find(c => c.device_type === "mobile");
  const laptopCoord = uiCoords.find(c => c.device_type === "laptop");

  return (
    <div className="checkpoint-card">
      <div className="card-header">
        <div className="checkpoint-info">
          <span className="sequence-badge">{checkpoint.sequence_order}</span>
          <h3>{checkpoint.checkpoint_name}</h3>
        </div>
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(checkpoint)}>✎</button>
          <button className="delete-btn" onClick={() => onDelete(checkpoint.checkpoint_id)}>✕</button>
        </div>
      </div>
      
      <div className="coordinates">
        <div className="coord-group">
          <span className="coord-label">Lat:</span>
          <span className="coord-value">{Number(checkpoint.latitude).toFixed(6)}</span>
        </div>
        <div className="coord-group">
          <span className="coord-label">Lng:</span>
          <span className="coord-value">{Number(checkpoint.longitude).toFixed(6)}</span>
        </div>
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
  );
}
