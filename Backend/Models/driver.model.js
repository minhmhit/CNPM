const { pool } = require("../config/connection_mysql");

const addDriverInfo = async (driver_id, driverData) => {
  try {
    const { name, phone_number } = driverData;
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (phone_number) {
      fields.push("phone_number = ?");
      values.push(phone_number);
    }
    values.push(driver_id);

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const [result] = await pool.query(
      `UPDATE drivers SET ${fields.join(", ")} WHERE driver_id = ?`,
      [...values, driver_id]
    );
    const data = { result, driver_id, ...driverData };
    return data;
  } catch (error) {
    console.error("lỗi khi thêm thông tin tài xế:", error);
    throw error;
  }
};

const getDriverById = async (driver_id) => {
  try {
    const [rows] = await pool.query(
      "SELECT d.*, u.username, u.email FROM drivers d JOIN users u ON d.userid = u.userid WHERE d.driver_id = ?",
      [driver_id]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy thông tin tài xế:", error);
    throw error;
  }
};

const getDriverByUserId = async (userid) => {
  try {
    const [rows] = await pool.query(
      "SELECT d.*, u.username, u.email FROM drivers d JOIN users u ON d.userid = u.userid WHERE d.userid = ?",
      [userid]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy thông tin tài xế:", error);
    throw error;
  }
};

const getDriverSchedules = async (driver_id) => {
  try {
    const [rows] = await pool.query(
      `
            SELECT 
                sch.schedule_id, sch.date, sch.start_time, sch.end_time, sch.status,
                r.name as route_name, r.description as route_description,
                v.license_plate, v.model as bus_model, v.capacity,
                COUNT(DISTINCT ss.student_id) as student_count
            FROM schedules sch
            LEFT JOIN routes r ON sch.route_id = r.route_id
            LEFT JOIN vehicles v ON sch.bus_id = v.bus_id
            LEFT JOIN schedule_students ss ON sch.schedule_id = ss.schedule_id
            WHERE sch.driver_id = ?
            GROUP BY sch.schedule_id
            ORDER BY sch.date DESC, sch.start_time DESC
        `,
      [driver_id]
    );
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy lịch trình tài xế:", error);
    throw error;
  }
};

const getDriverSessions = async (driver_id, date = null) => {
  try {
    let query = `
            SELECT 
                ds.session_id, ds.start_time, ds.end_time, ds.status,
                sch.schedule_id, sch.date,
                r.name as route_name,
                v.license_plate, v.model as bus_model
            FROM driver_sessions ds
            JOIN schedules sch ON ds.schedule_id = sch.schedule_id
            LEFT JOIN routes r ON sch.route_id = r.route_id
            LEFT JOIN vehicles v ON sch.bus_id = v.bus_id
            WHERE ds.driver_id = ?
        `;
    const params = [driver_id];

    if (date) {
      query += " AND sch.date = ?";
      params.push(date);
    }

    query += " ORDER BY ds.start_time DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy phiên làm việc tài xế:", error);
    throw error;
  }
};

const startDriverSession = async (session_id) => {
  //cập nhật trạng thái driver_sessions thành started và trạng thái schedule thành in_progress
  let newSession_id = null;
  try {
    const sql = `UPDATE schedules sch
      JOIN driver_sessions ds ON sch.schedule_id = ds.schedule_id
      SET ds.start_time = NOW(), ds.status = 'started', sch.status = 'in_progress'
      WHERE ds.session_id = ?`;
    const [result] = await pool.query(sql, [session_id]);
    if (result.affectedRows) {
      newSession_id = session_id;
    }
    return newSession_id;
  } catch (error) {
    console.error("lỗi khi bắt đầu phiên làm việc:", error);
    throw error;
  }
};

const endDriverSession = async (session_id) => {
  try {
    const sql = `UPDATE schedules sch
      JOIN driver_sessions ds ON sch.schedule_id = ds.schedule_id
      SET ds.end_time = NOW(), ds.status = 'completed', sch.status = 'completed'
      WHERE ds.session_id = ?`;
    const [result] = await pool.query(sql, [session_id]);
    if (result.affectedRows) {
      endSession_id = session_id;
    }
    return endSession_id;
  } catch (error) {
    console.error("lỗi khi kết thúc phiên làm việc:", error);
    throw error;
  }
};

const updateDriverLocation = async (driver_id, latitude, longitude) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO live_tracking (driver_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, timestamp = NOW()",
      [driver_id, latitude, longitude, latitude, longitude]
    );
    return result;
  } catch (error) {
    console.error("lỗi khi cập nhật vị trí tài xế:", error);
    throw error;
  }
};

const getDriverLocation = async (driver_id) => {
  try {
    const [rows] = await pool.query(
      "SELECT latitude, longitude, timestamp FROM live_tracking WHERE driver_id = ? ORDER BY timestamp DESC LIMIT 1",
      [driver_id]
    );
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy vị trí tài xế:", error);
    throw error;
  }
};

const getAssignedStudents = async (driver_id, schedule_id) => {
  try {
    let query = `
      SELECT 
        s.student_id, s.name, s.className,
        u.username, u.email,
        sch.schedule_id, sch.date, sch.start_time,
        ss.pickup_status, ss.dropoff_status,
      
        pickup.stop_name as pickup_stop,
        pickup.stop_order,
        dropoff.stop_name as dropoff_stop
      FROM schedules sch
      JOIN schedule_students ss ON sch.schedule_id = ss.schedule_id
      JOIN students s ON ss.student_id = s.student_id
      JOIN users u ON s.userid = u.userid
      LEFT JOIN stop_points pickup ON s.pickup_location = pickup.stop_id
      LEFT JOIN stop_points dropoff ON s.dropoff_location = dropoff.stop_id
      WHERE sch.driver_id = ?
    `;
    const params = [driver_id];

    if (schedule_id) {
      query += " AND sch.schedule_id = ?";
      params.push(schedule_id);
    }

    query += " ORDER BY sch.date DESC, pickup.stop_order ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("lỗi khi lấy danh sách học sinh được phân công:", error);
    throw error;
  }
};

const markStudentAttendance = async (
  driver_id,
  student_id,
  schedule_id,
  status
) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO attendance_logs (student_id, schedule_id, driver_id, status, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [student_id, schedule_id, driver_id, status]
    );
    return result;
  } catch (error) {
    console.error("lỗi khi điểm danh học sinh:", error);
    throw error;
  }
};

module.exports = {
  addDriverInfo,
  getDriverById,
  getDriverByUserId,
  getDriverSchedules,
  getDriverSessions,
  startDriverSession,
  endDriverSession,
  updateDriverLocation,
  getDriverLocation,
  getAssignedStudents,
  markStudentAttendance,
};
