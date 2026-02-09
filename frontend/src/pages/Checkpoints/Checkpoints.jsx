import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CheckpointCard from "../../components/CheckpointCard/CheckpointCard";
import AddCheckpointForm from "./AddCheckpointForm";
import "./Checkpoints.css";

export default function Checkpoints() {
  const { checkpoints, loading, error, addCheckpoint, removeCheckpoint } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);

  const handleAddCheckpoint = async (data) => {
    try {
      await addCheckpoint(data);
      setShowForm(false);
    } catch (err) {
      console.error("Error adding checkpoint:", err);
    }
  };

  const handleDelete = async (checkpointId) => {
    if (window.confirm("Are you sure you want to delete this checkpoint?")) {
      try {
        await removeCheckpoint(checkpointId);
      } catch (err) {
        console.error("Error deleting checkpoint:", err);
      }
    }
  };

  // Sort checkpoints by sequence order
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a.sequence_order - b.sequence_order);

  return (
    <div className="checkpoints-container">
      <div className="checkpoints-header">
        <h1>📍 Checkpoints Management</h1>
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Hide Form" : "+ Add Checkpoint"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-section">
          <AddCheckpointForm
            onSubmit={handleAddCheckpoint}
            loading={loading}
          />
        </div>
      )}

      <div className="checkpoints-list">
        {loading ? (
          <div className="loading">Loading checkpoints...</div>
        ) : sortedCheckpoints.length === 0 ? (
          <div className="no-data">No checkpoints yet. Add one to get started!</div>
        ) : (
          <>
            <h2>Total Checkpoints: {sortedCheckpoints.length}</h2>
            {sortedCheckpoints.map(checkpoint => (
              <CheckpointCard
                key={checkpoint.checkpoint_id}
                checkpoint={checkpoint}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
