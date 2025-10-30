const { pool } = require("../config/connection_mysql");

const addStudentInfo = async (student_id, studentData) => {
  try {
    const { className, pickup_location, dropoff_location } = studentData;
    // Kiểm tra xem pickup/dropoff (nếu không null/undefined) có tồn tại trong stop_points không
    const checkSql = "SELECT stop_id FROM stop_points WHERE stop_id = ?";

    if (pickup_location != null) {
      const [pickupRows] = await pool.query(checkSql, [pickup_location]);
      if (pickupRows.length === 0) {
        throw new Error("pickup_location không tồn tại trong stop_points");
      }
    }

    if (dropoff_location != null) {
      const [dropoffRows] = await pool.query(checkSql, [dropoff_location]);
      if (dropoffRows.length === 0) {
        throw new Error("dropoff_location không tồn tại trong stop_points");
      }
    }

    const [result] = await pool.query(
      "UPDATE students SET className = ?, pickup_location = ?, dropoff_location = ? WHERE student_id = ?",
      [className, pickup_location, dropoff_location, student_id]
    );
    const data = { student_id, ...studentData };
    return { data, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("lỗi khi thêm thông tin học sinh:", error);
    throw error;
  }
};

const getStudentById = async (student_id) => {
  try {
    const sql =`SELECT 
         s.*,  u.email,
         pickup.stop_name AS pickup_name, pickup.latitude AS pickup_latitude, pickup.longitude AS pickup_longitude,
         dropoff.stop_name AS dropoff_name, dropoff.latitude AS dropoff_latitude, dropoff.longitude AS dropoff_longitude
       FROM students s
       JOIN users u ON s.userid = u.userid
       LEFT JOIN stop_points pickup ON s.pickup_location = pickup.stop_id
       LEFT JOIN stop_points dropoff ON s.dropoff_location = dropoff.stop_id
       WHERE s.student_id = ?`

    const [rows] = await pool.query(sql, [student_id]);
    return rows[0];
  } catch (error) {
    console.error("lỗi khi lấy thông tin học sinh:", error);
    throw error;
  }
};

const getStudentByUserId = async (userid) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         s.*, u.username, u.email,
         pickup.stop_name AS pickup_name, pickup.latitude AS pickup_latitude, pickup.longitude AS pickup_longitude,
         dropoff.stop_name AS dropoff_name, dropoff.latitude AS dropoff_latitude, dropoff.longitude AS dropoff_longitude
       FROM students s
       JOIN users u ON s.userid = u.userid
       LEFT JOIN stop_points pickup ON s.pickup_location = pickup.stop_id
       LEFT JOIN stop_points dropoff ON s.dropoff_location = dropoff.stop_id
       WHERE s.userid = ?`,
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
    const sql = `
      SELECT
        s.schedule_id, s.date, s.start_time, s.end_time, s.status AS schedule_status,
        r.route_id, r.name AS route_name,
        v.bus_id, v.license_plate, d.driver_id, d.name AS driver_name,
        ss.pickup_status, ss.dropoff_status,
        pickup.stop_name AS pickup_stop_name, pickup.stop_order AS pickup_stop_order,
        dropoff.stop_name AS dropoff_stop_name, dropoff.stop_order AS dropoff_stop_order
      FROM schedule_students ss
      JOIN schedules s ON ss.schedule_id = s.schedule_id
      LEFT JOIN routes r ON s.route_id = r.route_id
      LEFT JOIN vehicles v ON s.bus_id = v.bus_id
      LEFT JOIN drivers d ON s.driver_id = d.driver_id
      JOIN students st ON ss.student_id = st.student_id
      LEFT JOIN stop_points pickup ON st.pickup_location = pickup.stop_id
      LEFT JOIN stop_points dropoff ON st.dropoff_location = dropoff.stop_id
      WHERE ss.student_id = ?
      ORDER BY s.date DESC, s.start_time DESC;
    `;
    const [rows] = await pool.query(sql, student_id);
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

const checkInStudent = async (schedule_id, student_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT pickup_status, dropoff_status 
      FROM schedule_students 
      WHERE schedule_id = ? AND student_id = ? FOR UPDATE`,
      [schedule_id, student_id]
    );

    if (rows.length === 0) {
      // Nếu chưa có bản ghi, tạo mới với trạng thái mặc định
      await conn.query(
        `INSERT INTO schedule_students (schedule_id, student_id, pickup_status, dropoff_status) 
        VALUES (?, ?, 'waiting', 'waiting')`,
        [schedule_id, student_id]
      );
      // tiếp tục với trạng thái waiting
    }

    // Lấy lại trạng thái sau khi đảm bảo bản ghi tồn tại
    const [[current]] = await conn.query(
      `SELECT pickup_status, dropoff_status 
      FROM schedule_students 
      WHERE schedule_id = ? AND student_id = ? FOR UPDATE`,
      [schedule_id, student_id]
    );

    if (current.pickup_status === "waiting") {
      // tiến: waiting -> picked_up
      await conn.query(
        `UPDATE schedule_students 
        SET pickup_status = 'picked_up' 
        WHERE schedule_id = ? AND student_id = ?`,
        [schedule_id, student_id]
      );
      await conn.query(
        `INSERT INTO attendance_logs
         (student_id, schedule_id, status) 
         VALUES (?, ?, 'picked_up')`,
        [student_id, schedule_id]
      );
      await conn.commit();
      return { success: true, message: "picked_up", data: { student_id, schedule_id } };
    } else {
      // không cho lùi hoặc lặp
      await conn.rollback();
      return {
        success: false,
        message: `Không thể checkin: pickup_status hiện tại = ${current.pickup_status}`,
      };
    }
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Lỗi khi checkin học sinh:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

const checkOutStudent = async (schedule_id, student_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT pickup_status, dropoff_status 
      FROM schedule_students 
      WHERE schedule_id = ? AND student_id = ? FOR UPDATE`,
      [schedule_id, student_id]
    );

    if (rows.length === 0) {
      // Nếu chưa có bản ghi thì không thể trả (phải checkin trước)
      await conn.rollback();
      return {
        success: false,
        message: "Không có bản ghi schedule_student — không thể checkout",
      };
    }

    const current = rows[0];

    // Chỉ cho tiến: pickup must be picked_up và dropoff must be waiting
    if (
      current.pickup_status === "picked_up" &&
      current.dropoff_status === "waiting"
    ) {
      await conn.query(
        `UPDATE schedule_students 
        SET dropoff_status = 'dropped_off' 
        WHERE schedule_id = ? AND student_id = ?`,
        [schedule_id, student_id]
      );
      await conn.query(
        `INSERT INTO attendance_logs (student_id, schedule_id, status) 
        VALUES (?, ?, 'dropped_off')`,
        [student_id, schedule_id]
      );
      await conn.commit();
      return { success: true, message: "dropped_off", data: { student_id, schedule_id } };
    } else {
      await conn.rollback();
      return {
        success: false,
        message: `Không thể checkout: pickup_status=${current.pickup_status}, dropoff_status=${current.dropoff_status}`,
      };
    }
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Lỗi khi checkout học sinh:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

const onLeaveStudent = async (schedule_id, student_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Kiểm tra xem học sinh có trong lịch trình không
    const [scheduleStudent] = await conn.query(
      `SELECT pickup_status, dropoff_status 
       FROM schedule_students 
       WHERE schedule_id = ? AND student_id = ?
       FOR UPDATE`,
      [schedule_id, student_id]
    );

    if (scheduleStudent.length === 0) {
      throw new Error("Học sinh không có trong lịch trình này");
    }

    // Chỉ cho phép đánh vắng khi học sinh chưa được đón
    if (scheduleStudent[0].pickup_status !== "waiting") {
      throw new Error(
        `Không thể đánh vắng: học sinh đã ${scheduleStudent[0].pickup_status}`
      );
    }

    // Cập nhật trạng thái trong schedule_students
    await conn.query(
      `UPDATE schedule_students 
       SET pickup_status = 'absent', dropoff_status = 'waiting'
       WHERE schedule_id = ? AND student_id = ?`,
      [schedule_id, student_id]
    );

    // Thêm log vào attendance_logs
    await conn.query(
      `INSERT INTO attendance_logs (student_id, schedule_id, status) 
       VALUES (?, ?, 'absent')`,
      [student_id, schedule_id]
    );

    await conn.commit();
    return {
      success: true,
      message: "Đã đánh dấu học sinh vắng mặt",
      data: { student_id, schedule_id },
    };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Lỗi khi đánh dấu học sinh vắng mặt:", error);
    throw error;
  } finally {
    if (conn) conn.release();
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
  checkInStudent,
  checkOutStudent,
  onLeaveStudent 
};
