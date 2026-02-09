import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../models/locationModel.js";

// GET all locations
export const getLocations = async (req, res, next) => {
  try {
    const locations = await getAllLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    next(error);
  }
};

// GET location by ID
export const getLocation = async (req, res, next) => {
  try {
    const location = await getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
};

// POST create new location
export const addLocation = async (req, res, next) => {
  try {
    const { locationName, locationDescription, geofencePoints, uiCoordinates } = req.body;

    // Validation
    if (!locationName || !locationDescription) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: locationName, locationDescription"
      });
    }

    if (!geofencePoints || geofencePoints.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least 3 geofence points are required to form a polygon"
      });
    }

    // Validate geofence points
    for (const point of geofencePoints) {
      if (typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
        return res.status(400).json({
          success: false,
          message: "Each geofence point must have valid latitude and longitude numbers"
        });
      }
    }

    const locationId = await createLocation(locationName, locationDescription, geofencePoints, uiCoordinates || []);
    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: { location_id: locationId }
    });
  } catch (error) {
    next(error);
  }
};

// PUT update location
export const editLocation = async (req, res, next) => {
  try {
    const { locationName, locationDescription, geofencePoints, uiCoordinates } = req.body;

    if (!locationName || !locationDescription) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: locationName, locationDescription"
      });
    }

    if (geofencePoints && geofencePoints.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least 3 geofence points are required"
      });
    }

    await updateLocation(req.params.id, locationName, locationDescription, geofencePoints, uiCoordinates);
    res.json({ success: true, message: "Location updated successfully" });
  } catch (error) {
    next(error);
  }
};

// DELETE location
export const removeLocation = async (req, res, next) => {
  try {
    await deleteLocation(req.params.id);
    res.json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    next(error);
  }
};
