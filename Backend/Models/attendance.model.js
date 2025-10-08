const {pool} = require("../config/connection_mysql");

const checkin = async (student_id, schedule_id, timestamp) => {
  console.log(" checkin called with:", {
    student_id,
    schedule_id,
    timestamp,
  });
  try {
    console.log("Inserting check-in record into database...");
    const sql = `
            INSERT INTO attendance_logs (student_id, schedule_id, status, timestamp)
            VALUES (?, ?, 'checkin', ?)
        `;
    await pool.query(sql, [student_id, schedule_id, timestamp || new Date()]);
    console.log("Check-in successful:", {
      student_id,
      schedule_id,
      timestamp,
    });
    return {
      message: "Check-in thành công",
      student_id,
      schedule_id,
      timestamp,
    };
  } catch (error) {
    return { message: "Lỗi check-in", error: error.message };
  }
};

const checkout = async (student_id, route_id, timestamp) => {
  try {
    const sql = `
            INSERT INTO attendance_logs (student_id, route_id, action, timestamp)
            VALUES (?, ?, 'checkout', ?)
        `;
    await pool.query(sql, [student_id, route_id, timestamp || new Date()]);
    return { message: "Check-out thành công" , student_id, route_id, timestamp};
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
