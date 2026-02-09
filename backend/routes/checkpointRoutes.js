import express from "express";
import {
  getCheckpoints,
  getCheckpoint,
  addCheckpoint,
  editCheckpoint,
  removeCheckpoint,
} from "../controllers/checkpointController.js";

const router = express.Router();

router.get("/", getCheckpoints);
router.get("/:id", getCheckpoint);
router.post("/", addCheckpoint);
router.put("/:id", editCheckpoint);
router.delete("/:id", removeCheckpoint);

export default router;
