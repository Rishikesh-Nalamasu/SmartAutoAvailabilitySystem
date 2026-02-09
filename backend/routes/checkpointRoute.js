import express from "express";
import {
  getCheckpoints,
  getCheckpoint,
  addCheckpoint,
  editCheckpoint,
  removeCheckpoint,
} from "../controllers/checkpointController.js";

const router = express.Router();

// GET all checkpoints
router.get("/", getCheckpoints);

// GET checkpoint by ID
router.get("/:id", getCheckpoint);

// POST create new checkpoint
router.post("/", addCheckpoint);

// PUT update checkpoint
router.put("/:id", editCheckpoint);

// DELETE checkpoint
router.delete("/:id", removeCheckpoint);

export default router;
