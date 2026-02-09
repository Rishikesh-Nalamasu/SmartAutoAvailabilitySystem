import {
  getAllCheckpoints,
  getCheckpointById,
  createCheckpoint,
  updateCheckpoint,
  deleteCheckpoint,
} from "../models/checkpointModel.js";

// GET all checkpoints
export const getCheckpoints = async (req, res, next) => {
  try {
    const checkpoints = await getAllCheckpoints();
    res.json({ success: true, data: checkpoints });
  } catch (error) {
    next(error);
  }
};

// GET checkpoint by ID
export const getCheckpoint = async (req, res, next) => {
  try {
    const checkpoint = await getCheckpointById(req.params.id);
    if (!checkpoint) {
      return res.status(404).json({ success: false, message: "Checkpoint not found" });
    }
    res.json({ success: true, data: checkpoint });
  } catch (error) {
    next(error);
  }
};

// POST create new checkpoint
export const addCheckpoint = async (req, res, next) => {
  try {
    const { checkpointName, latitude, longitude, sequenceOrder, uiCoordinates } = req.body;

    // Validation
    if (!checkpointName || latitude === undefined || longitude === undefined || sequenceOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: checkpointName, latitude, longitude, sequenceOrder"
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180"
      });
    }

    const checkpointId = await createCheckpoint(checkpointName, latitude, longitude, sequenceOrder, uiCoordinates || []);
    res.status(201).json({
      success: true,
      message: "Checkpoint created successfully",
      data: { checkpoint_id: checkpointId }
    });
  } catch (error) {
    next(error);
  }
};

// PUT update checkpoint
export const editCheckpoint = async (req, res, next) => {
  try {
    const { checkpointName, latitude, longitude, sequenceOrder, uiCoordinates } = req.body;

    if (!checkpointName || latitude === undefined || longitude === undefined || sequenceOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: checkpointName, latitude, longitude, sequenceOrder"
      });
    }

    await updateCheckpoint(req.params.id, checkpointName, latitude, longitude, sequenceOrder, uiCoordinates);
    res.json({ success: true, message: "Checkpoint updated successfully" });
  } catch (error) {
    next(error);
  }
};

// DELETE checkpoint
export const removeCheckpoint = async (req, res, next) => {
  try {
    await deleteCheckpoint(req.params.id);
    res.json({ success: true, message: "Checkpoint deleted successfully" });
  } catch (error) {
    next(error);
  }
};
