import express from "express";
import {
  getLocations,
  getLocation,
  addLocation,
  editLocation,
  removeLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocation);
router.post("/", addLocation);
router.put("/:id", editLocation);
router.delete("/:id", removeLocation);

export default router;
