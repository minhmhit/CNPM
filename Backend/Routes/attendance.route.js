const express = require("express");
const router = express.Router();
const {
    checkin, checkout, 
    getStudentAttendance, 
    getRouteAttendance
} = require("../Controllers/attendance.controller");

router.post("/checkin", checkin);
router.post("/checkout", checkout);
router.get("/student/:student_id", getStudentAttendance);
router.get("/route/:route_id", getRouteAttendance);

module.exports = router;
