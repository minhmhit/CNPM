const scheduleService = require('../Services/schedule.service');

const getAllSchedule = async (req, res) => {
    try {
      const schedules = await scheduleService.getAllSchedules();
      res.status(200).json(schedules);
    } catch (error) {
      console.error("lỗi khi lấy tất cả lịch trình:", error);
      res.status(500).json({ message: "lỗi khi lấy tất cả lịch trình", error: error.message });
    }
};

const createSchedule = async (req, res) => {
   
    try {
        const {
          driver_id,
          bus_id,
          route_id,
          date,          
          start_time,
          end_time
        } = req.body;
        const newSchedule = await scheduleService.createSchedule({
          driver_id,
          bus_id,
          route_id,
          date,          
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
          date,
          start_time,
          end_time,
        } = req.body;

        const updatedSchedule = await scheduleService.updateSchedule(
          schedule_id,
          {
            driver_id,
            bus_id,
            route_id,
            date,
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

const addStudentToSchedule = async (req, res) => {
  try {
    const { student_id, schedule_id } = req.body;

    // Kiểm tra học sinh đã có trong lịch trình chưa
    const exists = await scheduleService.checkStudentInSchedule(
      schedule_id,
      student_id
    );
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Học sinh đã có trong lịch trình này",
      });
    }

    const result = await scheduleService.addStudentToSchedule(
      schedule_id,
      student_id
    );

    res.status(201).json({
      success: true,
      message: "Thêm học sinh vào lịch trình thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
const addMultipleStudentsToSchedule = async (req, res) => {
  try {
    
    const { student_ids, schedule_id } = req.body;

    if (!Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách student_ids không hợp lệ",
      });
    }

    const result = await scheduleService.addMultipleStudentsToSchedule(
      schedule_id,
      student_ids
    );

    res.status(201).json({
      success: true,
      message: `Thêm ${student_ids.length} học sinh vào lịch trình thành công`,
      data: { affected_rows: result.affectedRows },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const removeStudentFromSchedule = async (req, res) => {
  try {
    const { schedule_id, student_id } = req.body;

    const result = await scheduleService.removeStudentFromSchedule(
      schedule_id,
      student_id
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh trong lịch trình",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa học sinh khỏi lịch trình thành công",
      data: { 
        affected_rows: result.affectedRows,
        schedule_id,
        student_id
       },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
const getStudentsBySchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    const students = await scheduleService.getStudentsBySchedule(
      schedule_id
    );

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const { schedule_id, student_id, status } = req.body;

    if (!["waiting", "picked_up", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const pickup_time = status === "picked_up" ? new Date() : null;
    const result = await scheduleService.updateStudentPickupStatus(
      schedule_id,
      student_id,
      status,
      pickup_time
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh trong lịch trình",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đón thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updateDropoffStatus = async (req, res) => {
  try {
    const { schedule_id, student_id } = req.params;
    const { status } = req.body;

    if (!["waiting", "dropped_off", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const dropoff_time = status === "dropped_off" ? new Date() : null;
    const result = await scheduleService.updateStudentDropoffStatus(
      schedule_id,
      student_id,
      status,
      dropoff_time
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh trong lịch trình",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái trả thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getDriverSchedule,
  getBusSchedule,
  addStudentToSchedule,
  addMultipleStudentsToSchedule,
  removeStudentFromSchedule,
  getStudentsBySchedule,
  updatePickupStatus,
  updateDropoffStatus,
  getAllSchedule
};