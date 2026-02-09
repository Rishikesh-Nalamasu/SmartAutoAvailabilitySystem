import express from "express";
import {
  getLocations,
  getLocation,
  addLocation,
  editLocation,
  removeLocation,
} from "../controllers/locationController.js";

const router = express.Router();

// GET all locations
router.get("/", getLocations);

// GET location by ID
router.get("/:id", getLocation);

// POST create new location
router.post("/", addLocation);

// PUT update location
router.put("/:id", editLocation);

// DELETE location
router.delete("/:id", removeLocation);

export default router;
