const scheduleService = require('../Services/schedule.service');
const createSchedule = async (req, res) => {
    try {
        const {
          driver_id,
          bus_id,
          route_id,
          student_id,
          start_time,
          end_time
        } = req.body;
        const newSchedule = await scheduleService.createSchedule({
          driver_id,
          bus_id,
          route_id,
          student_id,
          start_time,
          end_time
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error("lỗi khi tạo lịch trình:", error);
        res.status(500).json({ message: "lỗi khi tạo lịch trình", error: error.message });
    }
};
const updateSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const {
          driver_id,
          bus_id,
          route_id,
          student_id,
          start_time,
          end_time,
        } = req.body;

        const updatedSchedule = await scheduleService.updateSchedule(
          schedule_id,
          {
            driver_id,
            bus_id,
            route_id,
            student_id,
            start_time,
            end_time,
          }
        );
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error("lỗi khi cập nhật lịch trình:", error);
        res.status(500).json({ message: "lỗi khi cập nhật lịch trình", error: error.message });
    }
};
const deleteSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        await scheduleService.deleteSchedule(schedule_id);
        res.status(204).send();
    } catch (error) {
        console.error("lỗi khi xóa lịch trình:", error);
        res.status(500).json({ message: "lỗi khi xóa lịch trình", error: error.message });
    }
};
const getDriverSchedule = async (req, res) => {
    try {
        const { driver_id } = req.params;
        const driverSchedule = await scheduleService.getDriverSchedule(driver_id);
        res.status(200).json(driverSchedule);
    } catch (error) {
        console.error("lỗi khi lấy lịch trình của tài xế:", error);
        res.status(500).json({ message: "lỗi khi lấy lịch trình của tài xế", error: error.message });
    }
};
const getBusSchedule = async (req, res) => {
    try {
        const { bus_id } = req.params;
        const busSchedule = await scheduleService.getBusSchedule(bus_id);
        res.status(200).json(busSchedule);
    } catch (error) {
        console.error("lỗi khi lấy lịch trình của xe buýt:", error);
        res.status(500).json({ message: "lỗi khi lấy lịch trình của xe buýt", error: error.message });
    }
};
const getStudentSchedule = async (req, res) => {
    try {
        const { student_id } = req.params;
        const studentSchedule = await scheduleService.getStudentSchedule(student_id);
        res.status(200).json(studentSchedule);
    } catch (error) {
        console.error("lỗi khi lấy lịch trình của học sinh:", error);
        res.status(500).json({ message: "Lỗi khi lấy lịch trình của học sinh", error: error.message });
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