import pool from "../config/db.js";

// Get all locations
export const getAllLocations = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        l.location_id, 
        l.location_name, 
        l.location_description,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'point_id', gp.point_id,
            'latitude', gp.latitude,
            'longitude', gp.longitude,
            'sequence_order', gp.sequence_order
          )
        ) as geofence_points,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'ui_coord_id', uc.ui_coord_id,
            'device_type', uc.device_type,
            'x_coordinate', uc.x_coordinate,
            'y_coordinate', uc.y_coordinate
          )
        ) as ui_coordinates
      FROM Locations l
      LEFT JOIN Location_Geofence_Points gp ON l.location_id = gp.location_id
      LEFT JOIN Location_UI_Coordinates uc ON l.location_id = uc.location_id
      GROUP BY l.location_id
    `);
    return rows;
  } finally {
    connection.release();
  }
};

// Get location by ID
export const getLocationById = async (locationId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        l.location_id, 
        l.location_name, 
        l.location_description,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'point_id', gp.point_id,
            'latitude', gp.latitude,
            'longitude', gp.longitude,
            'sequence_order', gp.sequence_order
          )
        ) as geofence_points,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'ui_coord_id', uc.ui_coord_id,
            'device_type', uc.device_type,
            'x_coordinate', uc.x_coordinate,
            'y_coordinate', uc.y_coordinate
          )
        ) as ui_coordinates
      FROM Locations l
      LEFT JOIN Location_Geofence_Points gp ON l.location_id = gp.location_id
      LEFT JOIN Location_UI_Coordinates uc ON l.location_id = uc.location_id
      WHERE l.location_id = ?
      GROUP BY l.location_id
    `, [locationId]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
};

// Create new location with geofence points and UI coordinates
export const createLocation = async (locationName, locationDescription, geofencePoints, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert location
    const [result] = await connection.query(
      "INSERT INTO Locations (location_name, location_description) VALUES (?, ?)",
      [locationName, locationDescription]
    );
    const locationId = result.insertId;

    // Insert geofence points
    if (geofencePoints && geofencePoints.length > 0) {
      for (let i = 0; i < geofencePoints.length; i++) {
        const point = geofencePoints[i];
        await connection.query(
          "INSERT INTO Location_Geofence_Points (location_id, latitude, longitude, sequence_order) VALUES (?, ?, ?, ?)",
          [locationId, point.latitude, point.longitude, i]
        );
      }
    }

    // Insert UI coordinates
    if (uiCoordinates && uiCoordinates.length > 0) {
      for (const coord of uiCoordinates) {
        await connection.query(
          "INSERT INTO Location_UI_Coordinates (location_id, device_type, x_coordinate, y_coordinate) VALUES (?, ?, ?, ?)",
          [locationId, coord.device_type, coord.x_coordinate, coord.y_coordinate]
        );
      }
    }

    await connection.commit();
    return locationId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Update location
export const updateLocation = async (locationId, locationName, locationDescription) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "UPDATE Locations SET location_name = ?, location_description = ? WHERE location_id = ?",
      [locationName, locationDescription, locationId]
    );
    return true;
  } finally {
    connection.release();
  }
};

// Delete location
export const deleteLocation = async (locationId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete geofence points and UI coordinates (cascading)
    await connection.query("DELETE FROM Location_Geofence_Points WHERE location_id = ?", [locationId]);
    await connection.query("DELETE FROM Location_UI_Coordinates WHERE location_id = ?", [locationId]);
    await connection.query("DELETE FROM Locations WHERE location_id = ?", [locationId]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
