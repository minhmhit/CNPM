const studentModel = require("../Models/student.model");

const updateStudentInfo = async (req, res) => {
  try {
    const { student_id, className, pickup_location, dropoff_location } = req.body;
    const studentData = { className, pickup_location, dropoff_location };

    const result = await studentModel.addStudentInfo(student_id, studentData);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin học sinh thành công",
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const { student_id } = req.params;

    const student = await studentModel.getStudentById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
const getStudentById = async (req, res) => {
  try {
    const { student_id } = req.params;

    const student = await studentModel.getStudentById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
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
    const { userid } = req.params;

    const student = await studentModel.getStudentByUserId(userid);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
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

    const student = await studentModel.getStudentByUserId(userid);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh",
      });
    }

    const schedules = await studentModel.getStudentSchedules(
      student.student_id
    );

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

const getMyAttendance = async (req, res) => {
  try {
    const { userid } = req.body;
    const { date } = req.query;

    const student = await studentModel.getStudentByUserId(userid);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh",
      });
    }

    const attendance = await studentModel.getStudentAttendance(
      student.student_id,
      date
    );

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyRoute = async (req, res) => {
  try {
    const { userid } = req.user;

    const student = await studentModel.getStudentByUserId(userid);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh",
      });
    }

    const route = await studentModel.getStudentRouteAssignment(
      student.student_id
    );

    res.status(200).json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const { userid } = req.user;

    const student = await studentModel.getStudentByUserId(userid);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh",
      });
    }

    const notifications = await studentModel.getStudentNotifications(
      student.student_id
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const checkInStudent = async (req, res) => {
  try {
    const { student_id, schedule_id } = req.body;
    const result = await studentModel.checkInStudent(schedule_id, student_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  };
};
const checkOutStudent = async (req, res) => {
  try {
    const { student_id, schedule_id } = req.body;
    const result = await studentModel.checkOutStudent(schedule_id, student_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const onLeaveStudent = async (req, res) => {
  try {
    const { student_id, schedule_id } = req.body;
    const result = await studentModel.onLeaveStudent(schedule_id, student_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  updateStudentInfo,
  getStudentProfile,
  getMyProfile,
  getMySchedules,
  getMyAttendance,
  getMyRoute,
  getStudentById,
  getMyNotifications,
  checkInStudent,
  checkOutStudent,
  onLeaveStudent
};
