const express = require("express");
const router = express.Router();
const {
    getStudentProfile, 
    updateStudentInfo, 
    getMyProfile, 
    getMySchedules, 
    getMyAttendance, 
    getMyRoute, 
    getMyNotifications,
    getStudentById,
    checkInStudent,
    checkOutStudent,
    onLeaveStudent
} = require("../Services/student.service");
// const authMiddleware = require("../middleware/auth.middleware");

// Routes cho học sinh (cần xác thực)
router.get("/profile/:userid", getMyProfile);
router.get("/schedules/:userid", getMySchedules);
// router.post("/attendance", getMyAttendance);
// router.get("/route", getMyRoute);
router.post("/updateInfo", updateStudentInfo);
router.get("/notifications", getMyNotifications);
router.get("/:student_id", getStudentById);
router.post("/checkinStudent", checkInStudent);
router.post("/checkoutStudent", checkOutStudent);
router.post("/onLeaveStudent", onLeaveStudent );

// Routes cho admin quản lý học sinh
// router.get("/:student_id", getStudentProfile);
// router.put("/:student_id", updateStudentInfo);

module.exports = router;
