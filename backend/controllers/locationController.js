import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../models/locationModel.js";

// GET all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await getAllLocations();
    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locations",
      error: error.message,
    });
  }
};

// GET location by ID
export const getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await getLocationById(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location",
      error: error.message,
    });
  }
};

// POST create new location
export const addLocation = async (req, res) => {
  try {
    const { locationName, locationDescription, geofencePoints, uiCoordinates } = req.body;

    // Validation
    if (!locationName || !locationDescription || !geofencePoints || geofencePoints.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: locationName, locationDescription, geofencePoints (at least 1 point)",
      });
    }

    const locationId = await createLocation(
      locationName,
      locationDescription,
      geofencePoints,
      uiCoordinates || []
    );

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: { location_id: locationId },
    });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({
      success: false,
      message: "Error creating location",
      error: error.message,
    });
  }
};

// PUT update location
export const editLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { locationName, locationDescription } = req.body;

    if (!locationName || !locationDescription) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: locationName, locationDescription",
      });
    }

    await updateLocation(id, locationName, locationDescription);

    res.json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      success: false,
      message: "Error updating location",
      error: error.message,
    });
  }
};

// DELETE location
export const removeLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteLocation(id);

    res.json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting location",
      error: error.message,
    });
  }
};
