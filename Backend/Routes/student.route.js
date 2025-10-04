const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/student.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Routes cho học sinh (cần xác thực)
router.get("/profile", studentController.getMyProfile);
router.get("/schedules", studentController.getMySchedules);
router.get("/attendance", studentController.getMyAttendance);
router.get("/route", studentController.getMyRoute);
router.get("/notifications", studentController.getMyNotifications);

// Routes cho admin quản lý học sinh
router.get("/:student_id", studentController.getStudentProfile);
router.put("/:student_id", studentController.updateStudentInfo);

module.exports = router;
