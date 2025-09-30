const { pool } = require("../config/connection_mysql");

const addBus = async (busData) => {
    try {
        const [rows] = await pool.query("INSERT INTO buses SET ?", busData);
        return rows;
    } catch (error) {
        throw error;
    }
};

const updateBus = async (bus_id, busData) => {
    try {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(busData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        const [rows] = await pool.query(`UPDATE buses SET ${fields.join(", ")} WHERE bus_id = ?`, [...values, bus_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const deleteBus = async (bus_id) => {
    try {
        const [rows] = await pool.query("DELETE FROM buses WHERE bus_id = ?", [bus_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const getAllBuses = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM buses");
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addBus,
    updateBus,
    deleteBus,
    getAllBuses
};
