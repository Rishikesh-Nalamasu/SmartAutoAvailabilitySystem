import pool from "../config/db.js";

// Helper: Convert coordinates array to WKT POLYGON format
const coordinatesToWKT = (coordinates) => {
  const points = coordinates.map(coord => `${coord.longitude} ${coord.latitude}`);
  // Close the polygon
  if (points.length > 0 && points[0] !== points[points.length - 1]) {
    points.push(points[0]);
  }
  return `POLYGON((${points.join(', ')}))`;
};

// Helper: Parse WKT POLYGON to coordinates array
const parsePolygonToCoordinates = (wktPolygon) => {
  if (!wktPolygon) return [];
  const match = wktPolygon.match(/POLYGON\(\((.+)\)\)/i);
  if (!match) return [];
  return match[1].split(',').map((coordStr, index) => {
    const [longitude, latitude] = coordStr.trim().split(' ').map(Number);
    return { latitude, longitude, sequence_order: index };
  });
};

// Get all locations
export const getAllLocations = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        l.location_id, 
        l.location_name, 
        l.location_description,
        ST_AsText(gp.fence) as fence_wkt,
        gp.point_id
      FROM Locations l
      LEFT JOIN Location_Geofence_Points gp ON l.location_id = gp.location_id
    `);

    // Group and transform results
    const locationsMap = new Map();
    for (const row of rows) {
      if (!locationsMap.has(row.location_id)) {
        locationsMap.set(row.location_id, {
          location_id: row.location_id,
          location_name: row.location_name,
          location_description: row.location_description,
          geofence_points: parsePolygonToCoordinates(row.fence_wkt),
          ui_coordinates: []
        });
      }
    }

    // Get UI coordinates for all locations
    const [uiRows] = await connection.query(`
      SELECT location_id, ui_coord_id, device_type, x_coordinate, y_coordinate
      FROM Location_UI_Coordinates
    `);
    
    for (const ui of uiRows) {
      const loc = locationsMap.get(ui.location_id);
      if (loc) {
        loc.ui_coordinates.push({
          ui_coord_id: ui.ui_coord_id,
          device_type: ui.device_type,
          x_coordinate: ui.x_coordinate,
          y_coordinate: ui.y_coordinate
        });
      }
    }

    return Array.from(locationsMap.values());
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
        ST_AsText(gp.fence) as fence_wkt
      FROM Locations l
      LEFT JOIN Location_Geofence_Points gp ON l.location_id = gp.location_id
      WHERE l.location_id = ?
    `, [locationId]);

    if (!rows[0]) return null;

    const [uiRows] = await connection.query(`
      SELECT ui_coord_id, device_type, x_coordinate, y_coordinate
      FROM Location_UI_Coordinates WHERE location_id = ?
    `, [locationId]);

    return {
      location_id: rows[0].location_id,
      location_name: rows[0].location_name,
      location_description: rows[0].location_description,
      geofence_points: parsePolygonToCoordinates(rows[0].fence_wkt),
      ui_coordinates: uiRows
    };
  } finally {
    connection.release();
  }
};

// Create new location
export const createLocation = async (locationName, locationDescription, geofencePoints, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO Locations (location_name, location_description) VALUES (?, ?)",
      [locationName, locationDescription]
    );
    const locationId = result.insertId;

    // Insert geofence polygon
    if (geofencePoints && geofencePoints.length >= 3) {
      const wkt = coordinatesToWKT(geofencePoints);
      await connection.query(
        `INSERT INTO Location_Geofence_Points (location_id, fence) VALUES (?, ST_GeomFromText(?, 4326))`,
        [locationId, wkt]
      );
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
export const updateLocation = async (locationId, locationName, locationDescription, geofencePoints, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE Locations SET location_name = ?, location_description = ? WHERE location_id = ?",
      [locationName, locationDescription, locationId]
    );

    // Update geofence if provided
    if (geofencePoints && geofencePoints.length >= 3) {
      await connection.query("DELETE FROM Location_Geofence_Points WHERE location_id = ?", [locationId]);
      const wkt = coordinatesToWKT(geofencePoints);
      await connection.query(
        `INSERT INTO Location_Geofence_Points (location_id, fence) VALUES (?, ST_GeomFromText(?, 4326))`,
        [locationId, wkt]
      );
    }

    // Update UI coordinates if provided
    if (uiCoordinates !== undefined) {
      await connection.query("DELETE FROM Location_UI_Coordinates WHERE location_id = ?", [locationId]);
      if (uiCoordinates.length > 0) {
        for (const coord of uiCoordinates) {
          await connection.query(
            "INSERT INTO Location_UI_Coordinates (location_id, device_type, x_coordinate, y_coordinate) VALUES (?, ?, ?, ?)",
            [locationId, coord.device_type, coord.x_coordinate, coord.y_coordinate]
          );
        }
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Delete location
export const deleteLocation = async (locationId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
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
