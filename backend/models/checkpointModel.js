import pool from "../config/db.js";

// Get all checkpoints
export const getAllCheckpoints = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        c.checkpoint_id,
        c.checkpoint_name,
        c.latitude,
        c.longitude,
        c.sequence_order
      FROM Checkpoints c
      ORDER BY c.sequence_order
    `);

    // Get UI coordinates for all checkpoints
    const [uiRows] = await connection.query(`
      SELECT checkpoint_id, ui_coord_id, device_type, x_coordinate, y_coordinate
      FROM Checkpoint_UI_Coordinates
    `);

    // Map UI coordinates to checkpoints
    const checkpointsMap = new Map();
    for (const row of rows) {
      checkpointsMap.set(row.checkpoint_id, {
        ...row,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        ui_coordinates: []
      });
    }

    for (const ui of uiRows) {
      const checkpoint = checkpointsMap.get(ui.checkpoint_id);
      if (checkpoint) {
        checkpoint.ui_coordinates.push({
          ui_coord_id: ui.ui_coord_id,
          device_type: ui.device_type,
          x_coordinate: Number(ui.x_coordinate),
          y_coordinate: Number(ui.y_coordinate)
        });
      }
    }

    return Array.from(checkpointsMap.values());
  } finally {
    connection.release();
  }
};

// Get checkpoint by ID
export const getCheckpointById = async (checkpointId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT checkpoint_id, checkpoint_name, latitude, longitude, sequence_order
      FROM Checkpoints WHERE checkpoint_id = ?
    `, [checkpointId]);

    if (!rows[0]) return null;

    const [uiRows] = await connection.query(`
      SELECT ui_coord_id, device_type, x_coordinate, y_coordinate
      FROM Checkpoint_UI_Coordinates WHERE checkpoint_id = ?
    `, [checkpointId]);

    return {
      ...rows[0],
      latitude: Number(rows[0].latitude),
      longitude: Number(rows[0].longitude),
      ui_coordinates: uiRows.map(ui => ({
        ...ui,
        x_coordinate: Number(ui.x_coordinate),
        y_coordinate: Number(ui.y_coordinate)
      }))
    };
  } finally {
    connection.release();
  }
};

// Create new checkpoint
export const createCheckpoint = async (checkpointName, latitude, longitude, sequenceOrder, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO Checkpoints (checkpoint_name, latitude, longitude, sequence_order) VALUES (?, ?, ?, ?)",
      [checkpointName, latitude, longitude, sequenceOrder]
    );
    const checkpointId = result.insertId;

    // Insert UI coordinates
    if (uiCoordinates && uiCoordinates.length > 0) {
      for (const coord of uiCoordinates) {
        await connection.query(
          "INSERT INTO Checkpoint_UI_Coordinates (checkpoint_id, device_type, x_coordinate, y_coordinate) VALUES (?, ?, ?, ?)",
          [checkpointId, coord.device_type, coord.x_coordinate, coord.y_coordinate]
        );
      }
    }

    await connection.commit();
    return checkpointId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Update checkpoint
export const updateCheckpoint = async (checkpointId, checkpointName, latitude, longitude, sequenceOrder, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE Checkpoints SET checkpoint_name = ?, latitude = ?, longitude = ?, sequence_order = ? WHERE checkpoint_id = ?",
      [checkpointName, latitude, longitude, sequenceOrder, checkpointId]
    );

    // Update UI coordinates if provided
    if (uiCoordinates !== undefined) {
      await connection.query("DELETE FROM Checkpoint_UI_Coordinates WHERE checkpoint_id = ?", [checkpointId]);
      if (uiCoordinates.length > 0) {
        for (const coord of uiCoordinates) {
          await connection.query(
            "INSERT INTO Checkpoint_UI_Coordinates (checkpoint_id, device_type, x_coordinate, y_coordinate) VALUES (?, ?, ?, ?)",
            [checkpointId, coord.device_type, coord.x_coordinate, coord.y_coordinate]
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

// Delete checkpoint
export const deleteCheckpoint = async (checkpointId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM Checkpoint_UI_Coordinates WHERE checkpoint_id = ?", [checkpointId]);
    await connection.query("DELETE FROM Checkpoints WHERE checkpoint_id = ?", [checkpointId]);
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
