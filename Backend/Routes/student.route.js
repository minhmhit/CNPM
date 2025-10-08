const express = require("express");
const router = express.Router();
const {
    getStudentProfile, 
    updateStudentInfo, 
    getMyProfile, 
    getMySchedules, 
    getMyAttendance, 
    getMyRoute, 
    getMyNotifications
} = require("../Services/student.service");
// const authMiddleware = require("../middleware/auth.middleware");

// Routes cho học sinh (cần xác thực)
router.get("/profile", getMyProfile);
router.get("/schedules", getMySchedules);
router.get("/attendance", getMyAttendance);
router.get("/route", getMyRoute);
router.get("/notifications", getMyNotifications);

// Routes cho admin quản lý học sinh
router.get("/:student_id", getStudentProfile);
router.put("/:student_id", updateStudentInfo);

module.exports = router;
