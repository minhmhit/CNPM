const {pool} = require("../config/connection_mysql");

// Model for live tracking data
const getBusLocation = async (bus_id) => {
    try {
    const sql = `
                SELECT * FROM live_tracking
                WHERE bus_id = ?
                ORDER BY timestamp DESC
                LIMIT 1
            `;
        const [rows] = await pool.query(sql, [bus_id]); 
        return rows[0];
    } catch (error) {
        console.error("Error getting bus location:", error);
        throw error;
    }   
};

const getBusHistory = async (bus_id) => {
    try {
        const sql = `
            SELECT * FROM live_tracking
            WHERE bus_id = ?
            ORDER BY timestamp DESC
        `;
        const [rows] = await pool.query(sql, [bus_id]);
        return rows;
    } catch (error) {
        console.error("Error getting bus history:", error);
        throw error;
    }
};
const getDriverHistory = async (driver_id) => {
    try {
        const sql = `
            SELECT * FROM live_tracking
            WHERE driver_id = ?
            ORDER BY timestamp DESC
        `;
        const [rows] = await pool.query(sql, [driver_id]);
        return rows;
    } catch (error) {
        console.error("Error getting driver history:", error);
        throw error;
    }
};
const updateBusLocation = async (bus_id, driver_id, latitude, longitude) => {
    try {
        const sql = `
            INSERT INTO live_tracking (bus_id, driver_id, latitude, longitude, timestamp)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const [result] = await pool.query(sql, [bus_id, driver_id, latitude, longitude]);
        return result;
    } catch (error) {
        console.error("Error updating bus location:", error);
        throw error;
    }
};
module.exports = {
    getBusLocation,
    getBusHistory,
    getDriverHistory,
    updateBusLocation,
};