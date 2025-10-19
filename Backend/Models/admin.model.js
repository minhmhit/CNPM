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
//lấy tất cả tài xế
const getAllDrivers = async () => {
  try {
    const sql = "SELECT * FROM drivers WHERE 1";
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy tất cả tài xế:", error);
    throw error;
  }
};
const getAllStudents = async () => {
  try {
    const sql = `SELECT 
         s.*, u.email,
         pickup.stop_name AS pickup_name, 
         dropoff.stop_name AS dropoff_name
       FROM students s
       JOIN users u ON s.userid = u.userid
       LEFT JOIN stop_points pickup ON s.pickup_location = pickup.stop_id
       LEFT JOIN stop_points dropoff ON s.dropoff_location = dropoff.stop_id
       WHERE 1`;
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy tất cả học sinh:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getAllDrivers,
  getAllStudents,
};
