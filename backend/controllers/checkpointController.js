import {
  getAllCheckpoints,
  getCheckpointById,
  createCheckpoint,
  updateCheckpoint,
  deleteCheckpoint,
} from "../models/checkpointModel.js";

// GET all checkpoints
export const getCheckpoints = async (req, res) => {
  try {
    const checkpoints = await getAllCheckpoints();
    res.json({
      success: true,
      data: checkpoints,
    });
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching checkpoints",
      error: error.message,
    });
  }
};

// GET checkpoint by ID
export const getCheckpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const checkpoint = await getCheckpointById(id);

    if (!checkpoint) {
      return res.status(404).json({
        success: false,
        message: "Checkpoint not found",
      });
    }

    res.json({
      success: true,
      data: checkpoint,
    });
  } catch (error) {
    console.error("Error fetching checkpoint:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching checkpoint",
      error: error.message,
    });
  }
};

// POST create new checkpoint
export const addCheckpoint = async (req, res) => {
  try {
    const { checkpointName, latitude, longitude, sequenceOrder, uiCoordinates } = req.body;

    // Validation
    if (!checkpointName || latitude === undefined || longitude === undefined || sequenceOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: checkpointName, latitude, longitude, sequenceOrder",
      });
    }

    const checkpointId = await createCheckpoint(
      checkpointName,
      latitude,
      longitude,
      sequenceOrder,
      uiCoordinates || []
    );

    res.status(201).json({
      success: true,
      message: "Checkpoint created successfully",
      data: { checkpoint_id: checkpointId },
    });
  } catch (error) {
    console.error("Error creating checkpoint:", error);
    res.status(500).json({
      success: false,
      message: "Error creating checkpoint",
      error: error.message,
    });
  }
};

// PUT update checkpoint
export const editCheckpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkpointName, latitude, longitude, sequenceOrder } = req.body;

    if (!checkpointName || latitude === undefined || longitude === undefined || sequenceOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: checkpointName, latitude, longitude, sequenceOrder",
      });
    }

    await updateCheckpoint(id, checkpointName, latitude, longitude, sequenceOrder);

    res.json({
      success: true,
      message: "Checkpoint updated successfully",
    });
  } catch (error) {
    console.error("Error updating checkpoint:", error);
    res.status(500).json({
      success: false,
      message: "Error updating checkpoint",
      error: error.message,
    });
  }
};

// DELETE checkpoint
export const removeCheckpoint = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCheckpoint(id);

    res.json({
      success: true,
      message: "Checkpoint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting checkpoint:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting checkpoint",
      error: error.message,
    });
  }
};
