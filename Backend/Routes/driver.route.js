const express = require("express");
const router = express.Router();
const {
    getMyProfile,
    getMySchedules,
    getMySessions,
    getMyStudents,
    getMyLocation,
    startSession,
    endSession,
    updateLocation,
    markAttendance,
    getDriverProfile,
    updateDriverInfo
  } = require("../Services/driver.service");

router.get("/profile", getMyProfile);
router.get("/schedules", getMySchedules);
router.get("/sessions", getMySessions);
router.get("/students", getMyStudents);
router.get("/location", getMyLocation);
router.post("/session/start", startSession);
router.put("/session/:session_id/end", endSession);
router.put("/update/location", updateLocation);
router.post("/attendance", markAttendance);
// Routes cho admin quản lý tài xế
router.get("/:driver_id", getDriverProfile);
router.put("/edit/:driver_id", updateDriverInfo);

module.exports = router;
