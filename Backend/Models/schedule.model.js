const {pool} = require('../config/connection_mysql');

const getAllSchedules = async () => {
    try {
        const sql = `
    SELECT 
        s.*,
        r.name as route_name,
        d.name as driver_name,
        v.license_plate as bus_name
    FROM schedules s
    LEFT JOIN routes r ON s.route_id = r.route_id
    LEFT JOIN drivers d ON s.driver_id = d.driver_id
    LEFT JOIN vehicles v ON s.bus_id = v.bus_id
    ORDER BY s.date DESC, s.start_time DESC
`;
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};

const createSchedule = async (scheduleData) => {
  //if date is null set to current day
  if (!scheduleData.date) {
    scheduleData.date = new Date();
  }
    try {
        const {
          driver_id,
          bus_id,
          route_id,
          date,
          
          start_time,
          end_time,
        } = scheduleData;
        const sql = `
            INSERT INTO schedules (driver_id, bus_id, route_id, date,  start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
          driver_id,
          bus_id,
          route_id,
          date,
          
          start_time,
          end_time,
        ]);
        const data = { schedule_id: result.insertId, ...scheduleData };
        //tạo mới session với status 'scheduled'
        if (result){
         const formatDate = date.toISOString().slice(0, 10);
         const startTimestamp = new Date(`${formatDate}T${start_time}`);
         const endTimestamp = new Date(`${formatDate}T${end_time}`);
          const sqlSession = `
            INSERT INTO driver_sessions (driver_id, bus_id, schedule_id, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?, 'active')
          `;
          await pool.query(sqlSession, [driver_id, bus_id, result.insertId, startTimestamp, endTimestamp]);
          
        }
        return data;
    } catch (error) {
        throw error;
    }
};
const updateSchedule = async (schedule_id, scheduleData) => {
    try {
        const {
          driver_id,
          bus_id,
          route_id,
          date,
          start_time,
          end_time,
        } = scheduleData;
        const fields = [];
        const values = [];
        if (driver_id) {
          fields.push("driver_id = ?");
          values.push(driver_id);
        }
        if (bus_id) {
          fields.push("bus_id = ?");
          values.push(bus_id);
        }
        if (route_id) {
          fields.push("route_id = ?");
          values.push(route_id);
        }
        
        if (start_time) {
          fields.push("start_time = ?");
          values.push(start_time);
        }
        if (date) {
          fields.push("date = ?");
          values.push(date);
        }
        if (end_time) {
          fields.push("end_time = ?");
          values.push(end_time);
        }
        if (fields.length === 0)
          return { message: "Không có dữ liệu cập nhật" };
        values.push(schedule_id);
        const sql = `UPDATE schedules SET ${fields.join(
          ", "
        )} WHERE schedule_id = ?`;
        const result = await pool.query(sql, values);
        const data = { schedule_id, ...scheduleData };
        return { message: "Cập nhật lịch trình thành công", data: data };
    } catch (error) {
        throw error;
    }
};
const deleteSchedule = async (schedule_id) => {
    try {
      // set status to inactive instead of deleting
        const sql = `UPDATE schedules SET status = 'canceled' WHERE schedule_id = ?`;
        await pool.query(sql, [schedule_id]);
        return { message: "Xóa lịch trình thành công" };
    } catch (error) {
        throw error;
    }
};
const getDriverSchedule = async (driver_id) => {
    try {
       const sql = `SELECT * FROM schedules WHERE driver_id = ? ORDER BY start_time DESC`;
       const [rows] = await pool.query(sql, [driver_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};
const getBusSchedule = async (bus_id) => {
    try {
        const sql = `SELECT * FROM schedules WHERE bus_id = ? ORDER BY start_time DESC`;
        const [rows] = await pool.query(sql, [bus_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};
// thêm 1 hs
const addStudentToSchedule = async (schedule_id, student_id) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO schedule_students (schedule_id, student_id) VALUES (?, ?)",
      [schedule_id, student_id]
    );
    const data = { schedule_id, student_id, id: result.insertId };
    return data;
  } catch (error) {
    console.error("Lỗi khi thêm học sinh vào lịch trình:", error);
    throw error;
  }
};
// thêm nhiều hs
const addMultipleStudentsToSchedule = async (schedule_id, student_ids) => {
  try {
    const values = student_ids.map((student_id) => [schedule_id, student_id]);
    const [result] = await pool.query(
      "INSERT INTO schedule_students (schedule_id, student_id) VALUES ?",
      [values]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi thêm nhiều học sinh vào lịch trình:", error);
    throw error;
  }
};
const removeStudentFromSchedule = async (schedule_id, student_id) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM schedule_students WHERE schedule_id = ? AND student_id = ?",
      [schedule_id, student_id]
    );
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa học sinh khỏi lịch trình:", error);
    throw error;
  }
};

const getStudentsBySchedule = async (schedule_id) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT 
          ss.id,
          ss.schedule_id,
          ss.student_id,
          ss.pickup_status,
          ss.dropoff_status,                
          s.name as student_name,
          s.className,
          u.username,
          u.email,
          s.pickup_location,
          s.dropoff_location,
          pickup_stop.stop_name as pickup_stop_name,
          dropoff_stop.stop_name as dropoff_stop_name
        FROM schedule_students ss
        JOIN students s ON ss.student_id = s.student_id
        JOIN users u ON s.userid = u.userid
        LEFT JOIN stop_points pickup_stop ON s.pickup_location = pickup_stop.stop_id
        LEFT JOIN stop_points dropoff_stop ON s.dropoff_location = dropoff_stop.stop_id
        WHERE ss.schedule_id = ?
        ORDER BY pickup_stop.stop_order ASC, s.name ASC
      `,
      [schedule_id]
    );
    return rows;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh theo lịch trình:", error);
    throw error;
  }
};

const updateStudentPickupStatus = async (schedule_id, student_id, status, pickup_time = null) => {
    try {
        const [result] = await pool.query(
            "UPDATE schedule_students SET pickup_status = ?, pickup_time = ? WHERE schedule_id = ? AND student_id = ?",
            [status, pickup_time || new Date(), schedule_id, student_id]
        );
        return result;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đón học sinh:", error);
        throw error;
    }
};

const updateStudentDropoffStatus = async (schedule_id, student_id, status, dropoff_time = null) => {
    try {
        const [result] = await pool.query(
            "UPDATE schedule_students SET dropoff_status = ?, dropoff_time = ? WHERE schedule_id = ? AND student_id = ?",
            [status, dropoff_time || new Date(), schedule_id, student_id]
        );
        return result;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái trả học sinh:", error);
        throw error;
    }
};
const checkStudentInSchedule = async (schedule_id, student_id) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM schedule_students WHERE schedule_id = ? AND student_id = ?",
            [schedule_id, student_id]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Lỗi khi kiểm tra học sinh trong lịch trình:", error);
        throw error;
    }
};

module.exports = {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    checkStudentInSchedule,
    getDriverSchedule,
    getBusSchedule,
    addStudentToSchedule,
    removeStudentFromSchedule,
    addMultipleStudentsToSchedule,
    getStudentsBySchedule,
    updateStudentPickupStatus,
    updateStudentDropoffStatus,
    getAllSchedules
};
