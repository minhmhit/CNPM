const {pool} = require("../config/connection_mysql");

const checkin = async (student_id, route_id, timestamps) => {
  try {
    const sql = `
            INSERT INTO attendance_logs (student_id, route_id, action, timestamp)
            VALUES (?, ?, 'checkin', ?)
        `;
    await pool.query(sql, [student_id, route_id, timestamps || new Date()]);
    return { message: "Check-in thành công" , student_id, route_id, timestamps};
  } catch (error) {
    return { message: "Lỗi check-in", error: error.message };
  }
};

const checkout = async (student_id, route_id, timestamps) => {
  try {
    const sql = `
            INSERT INTO attendance_logs (student_id, route_id, action, timestamp)
            VALUES (?, ?, 'checkout', ?)
        `;
    await pool.query(sql, [student_id, route_id, timestamps || new Date()]);
    return { message: "Check-out thành công" , student_id, route_id, timestamps};
  } catch (error) {
    return { message: "Lỗi check-out", error: error.message };
  }
};


const getStudentAttendance = async (student_id) => {
  try {
    const sql = `
            SELECT * FROM attendance_logs
            WHERE student_id = ?
        `;
    const [rows] = await pool.query(sql, [student_id]);
    return rows;
  } catch (error) {
    console.error("Error getting student attendance:", error);
    throw error;
  }
};

const getRouteAttendance = async (route_id) => {
  try {
    const sql = `
            SELECT * FROM attendance_logs
            WHERE route_id = ?
        `;
    const [rows] = await pool.query(sql, [route_id]);
    return rows;
  } catch (error) {
    console.error("Error getting route attendance:", error);
    throw error;
  }
  
};
module.exports = {
  checkin,
  checkout,
  getStudentAttendance,
  getRouteAttendance
};
