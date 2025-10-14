const {pool} = require('../config/connection_mysql');

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
          student_id,
          start_time,
          end_time,
        } = scheduleData;
        const sql = `
            INSERT INTO schedules (driver_id, bus_id, route_id, date, student_id, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
          driver_id,
          bus_id,
          route_id,
          date,
          student_id,
          start_time,
          end_time,
        ]);
        const data = { schedule_id: result.insertId, ...scheduleData };
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
          student_id,
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
        if (student_id) {
          fields.push("student_id = ?");
          values.push(student_id);
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
const getStudentSchedule = async (student_id) => {
    try {
        const sql = `SELECT * FROM schedules WHERE student_id = ? ORDER BY start_time DESC`;
        const [rows] = await pool.query(sql, [student_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getDriverSchedule,
    getBusSchedule,
    getStudentSchedule
};
