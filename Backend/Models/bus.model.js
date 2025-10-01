const { pool } = require("../config/connection_mysql");

const addBus = async (busData) => {
    try {
        const [rows] = await pool.query("INSERT INTO vehicles SET ?", busData);
        //return the inserted bus with its new ID
        const newBus = { id: rows.insertId, ...busData };
        return newBus;
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
        const [rows] = await pool.query(`UPDATE vehicles SET ${fields.join(", ")} WHERE bus_id = ?`, [...values, bus_id]);
        //return the updated bus
        const updatedBus = { id: bus_id, ...busData };
        return updatedBus;
    } catch (error) {
        throw error;
    }
};

const deleteBus = async (bus_id) => {
    try {
        // change status to inactive instead of deleting
        const [rows] = await pool.query("UPDATE vehicles SET status = 'inactive' WHERE bus_id = ?", [bus_id]);
        //return the deleted bus data
        return { id: bus_id, status: 'inactive' };
    } catch (error) {
        throw error;
    }
};

const getAllBuses = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM vehicles");
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
