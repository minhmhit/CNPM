const { pool } = require("../config/connection_mysql");

const addStudentInfo = async (student_id, studentData) => {
  try {
    const { className, pickup_location, dropoff_location } = studentData;
    const [result] = await pool.query(
      "UPDATE students SET className = ?, pickup_location = ?, dropoff_location = ? WHERE student_id = ?",
      [className, pickup_location, dropoff_location, student_id]
    );
    return result;
  } catch (error) {
    console.error("lỗi khi thêm thông tin học sinh:", error);
    throw error;
  }
};

const getStudentById = async (student_id) => {
  try {
    const [rows] = await pool.query(
      "SELECT s.*, u.username, u.email FROM students s JOIN users u ON s.userid = u.userid WHERE s.student_id = ?",
      [student_id]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy thông tin học sinh:", error);
    throw error;
  }
};

const getStudentByUserId = async (userid) => {
  try {
    const [rows] = await pool.query(
      "SELECT s.*, u.username, u.email FROM students s JOIN users u ON s.userid = u.userid WHERE s.userid = ?",
      [userid]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy thông tin học sinh:", error);
    throw error;
  }
};

const getStudentSchedules = async (student_id) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT 
                sch.schedule_id, sch.date, sch.start_time, sch.end_time, sch.status,
                r.name as route_name, r.description as route_description,
                v.license_plate, v.model as bus_model,
                d.name as driver_name, d.phone_number as driver_phone
            FROM schedules sch
            LEFT JOIN routes r ON sch.route_id = r.route_id
            LEFT JOIN vehicles v ON sch.bus_id = v.bus_id
            LEFT JOIN drivers d ON sch.driver_id = d.driver_id
            WHERE sch.student_id = ?
            ORDER BY sch.date DESC, sch.start_time DESC
        `,
      [student_id]
    );
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy lịch trình học sinh:", error);
    throw error;
  }
};

const getStudentAttendance = async (student_id, date = null) => {
  try {
    let query = `
            SELECT 
                al.log_id, al.status, al.timestamp,
                sch.date, sch.start_time,
                r.name as route_name
            FROM attendance_logs al
            JOIN schedules sch ON al.schedule_id = sch.schedule_id
            LEFT JOIN routes r ON sch.route_id = r.route_id
            WHERE al.student_id = ?
        `;
    const params = [student_id];

    if (date) {
      query += " AND sch.date = ?";
      params.push(date);
    }

    query += " ORDER BY al.timestamp DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy điểm danh học sinh:", error);
    throw error;
  }
};

const getStudentRouteAssignment = async (student_id) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT 
                sra.assignment_id,
                r.route_id, r.name as route_name, r.description,
                pickup.stop_name as pickup_stop, pickup.lt as pickup_lat, pickup.lng as pickup_lng,
                dropoff.stop_name as dropoff_stop, dropoff.lt as dropoff_lat, dropoff.lng as dropoff_lng
            FROM student_route_assignments sra
            JOIN routes r ON sra.route_id = r.route_id
            JOIN stop_points pickup ON sra.pickup_stop_id = pickup.stop_id
            JOIN stop_points dropoff ON sra.dropoff_stop_id = dropoff.stop_id
            WHERE sra.student_id = ?
        `,
      [student_id]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy tuyến đường được phân công:", error);
    throw error;
  }
};

const getStudentNotifications = async (student_id) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT notification_id, message, timestamp, type
            FROM notifications
            WHERE recipient_type = 'parent' AND recipient_id = ?
            ORDER BY timestamp DESC
        `,
      [student_id]
    );
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy thông báo:", error);
    throw error;
  }
};

module.exports = {
  addStudentInfo,
  getStudentById,
  getStudentByUserId,
  getStudentSchedules,
  getStudentAttendance,
  getStudentRouteAssignment,
  getStudentNotifications,
};
