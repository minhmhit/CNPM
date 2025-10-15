const driverModel = require("../Models/driver.model");
const scheduleService = require("./schedule.service");
const NotificationService = require("../Services/notification.service");


const updateDriverInfo = async (req, res) => {
  try {
    const { driver_id } = req.params;
    const { name, phone_number, status } = req.body;
    const driverData = { name, phone_number, status };

    const result = await driverModel.addDriverInfo(driver_id, driverData);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài xế",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin tài xế thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const { driver_id } = req.params;

    const driver = await driverModel.getDriverById(driver_id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài xế",
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const { userid } = req.user;

    const driver = await driverModel.getDriverByUserId(userid);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMySchedules = async (req, res) => {
  try {
    const { userid } = req.params;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    const schedules = await driverModel.getDriverSchedules(driver.driver_id);

    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMySessions = async (req, res) => {
  try {
    const { userid } = req.params;
    const { date } = req.query;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    const sessions = await driverModel.getDriverSessions(
      driver.driver_id,
      date
    );

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const startSession = async (req, res) => {
  try {
    
    const { session_id } = req.body;
    const result = await driverModel.startDriverSession(
      session_id
    );
    // Gửi thông báo khi bắt đầu tuyến
    // const schedule = await driverModel.getScheduleById(schedule_id);
    // await NotificationService.notifyRouteStart(
    //   schedule.route_name,
    //   driver.name,
    //   schedule.estimated_time
    // );

    res.status(200).json({
      success: true,
      message: "Bắt đầu phiên làm việc thành công",
      data: { Session_id: result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const endSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    const result = await driverModel.endDriverSession(
      session_id
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiên làm việc",
      });
    }

    res.status(200).json({
      success: true,
      message: "Kết thúc phiên làm việc thành công",
      data: { endSession_id: result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { userid } = req.user;
    const { latitude, longitude } = req.body;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    await driverModel.updateDriverLocation(
      driver.driver_id,
      latitude,
      longitude
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật vị trí thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyLocation = async (req, res) => {
  try {
    const { userid } = req.user;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    const location = await driverModel.getDriverLocation(driver.driver_id);

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyStudents = async (req, res) => {
  try {
    const { userid } = req.user;
    const { schedule_id } = req.query;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    const students = await driverModel.getAssignedStudents(
      driver.driver_id,
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

const markAttendance = async (req, res) => {
  try {
    const { userid } = req.user;
    const { student_id, schedule_id, status } = req.body;

    const driver = await driverModel.getDriverByUserId(userid);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài xế",
      });
    }

    await driverModel.markStudentAttendance(
      driver.driver_id,
      student_id,
      schedule_id,
      status
    );
    // Gửi thông báo cho phụ huynh
    const currentTime = new Date().toLocaleTimeString("vi-VN");
    if (status === "picked_up") {
      await NotificationService.notifyStudentPickup(
        student_id,
        location,
        currentTime
      );
    } else if (status === "dropped_off") {
      await NotificationService.notifyStudentDropoff(
        student_id,
        location,
        currentTime
      );
    }

    res.status(200).json({
      success: true,
      message: "Điểm danh thành công",
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
  updateDriverInfo,
  getDriverProfile,
  getMyProfile,
  getMySchedules,
  getMySessions,
  startSession,
  endSession,
  updateLocation,
  getMyLocation,
  getMyStudents,
  markAttendance,
};
