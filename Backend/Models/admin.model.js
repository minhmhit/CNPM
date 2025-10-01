const { pool } = require("../config/connection_mysql");

const getAllUsers = async () => {
  try {
    const sql = "SELECT userid, username, email, role, isActive FROM users";
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
};
