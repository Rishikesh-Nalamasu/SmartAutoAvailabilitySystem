import pool from "../config/db.js";

// Get all checkpoints
export const getAllCheckpoints = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        checkpoint_id,
        checkpoint_name,
        latitude,
        longitude,
        sequence_order,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'ui_coord_id', uc.ui_coord_id,
            'device_type', uc.device_type,
            'x_coordinate', uc.x_coordinate,
            'y_coordinate', uc.y_coordinate
          )
        ) as ui_coordinates
      FROM Checkpoints c
      LEFT JOIN Checkpoint_UI_Coordinates uc ON c.checkpoint_id = uc.checkpoint_id
      GROUP BY c.checkpoint_id
      ORDER BY c.sequence_order
    `);
    return rows;
  } finally {
    connection.release();
  }
};

// Get checkpoint by ID
export const getCheckpointById = async (checkpointId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        checkpoint_id,
        checkpoint_name,
        latitude,
        longitude,
        sequence_order,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'ui_coord_id', uc.ui_coord_id,
            'device_type', uc.device_type,
            'x_coordinate', uc.x_coordinate,
            'y_coordinate', uc.y_coordinate
          )
        ) as ui_coordinates
      FROM Checkpoints c
      LEFT JOIN Checkpoint_UI_Coordinates uc ON c.checkpoint_id = uc.checkpoint_id
      WHERE c.checkpoint_id = ?
      GROUP BY c.checkpoint_id
    `, [checkpointId]);
    return rows[0] || null;
  } finally {
    connection.release();
  }
};

// Create new checkpoint with UI coordinates
export const createCheckpoint = async (checkpointName, latitude, longitude, sequenceOrder, uiCoordinates) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert checkpoint
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
export const updateCheckpoint = async (checkpointId, checkpointName, latitude, longitude, sequenceOrder) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      "UPDATE Checkpoints SET checkpoint_name = ?, latitude = ?, longitude = ?, sequence_order = ? WHERE checkpoint_id = ?",
      [checkpointName, latitude, longitude, sequenceOrder, checkpointId]
    );
    return true;
  } finally {
    connection.release();
  }
};

// Delete checkpoint
export const deleteCheckpoint = async (checkpointId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete UI coordinates
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
