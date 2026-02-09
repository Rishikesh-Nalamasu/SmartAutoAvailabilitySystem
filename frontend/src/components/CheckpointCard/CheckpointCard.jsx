import "./CheckpointCard.css";

export default function CheckpointCard({ checkpoint, onDelete }) {
  const uiCoordinates = checkpoint.ui_coordinates?.filter(c => c !== null) || [];

  return (
    <div className="checkpoint-card">
      <div className="card-header">
        <div className="checkpoint-info">
          <span className="sequence-badge">{checkpoint.sequence_order}</span>
          <h2>{checkpoint.checkpoint_name}</h2>
        </div>
        <button 
          className="delete-btn"
          onClick={() => onDelete(checkpoint.checkpoint_id)}
          title="Delete checkpoint"
        >
          ✕
        </button>
      </div>

      <div className="coordinates">
        <div className="coord-item">
          <span className="coord-label">Latitude:</span>
          <span className="coord-value">{checkpoint.latitude.toFixed(6)}</span>
        </div>
        <div className="coord-item">
          <span className="coord-label">Longitude:</span>
          <span className="coord-value">{checkpoint.longitude.toFixed(6)}</span>
        </div>
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
