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
router.get("/schedules/:userid", getMySchedules);
router.get("/sessions/:userid", getMySessions);
router.get("/students/:userid", getMyStudents);
router.get("/location/:userid", getMyLocation);
router.put("/session/start", startSession);
router.put("/session/:session_id/end", endSession);
router.put("/update/location", updateLocation);
router.post("/attendance", markAttendance);
// Routes cho admin quản lý tài xế

router.get("/:driver_id", getDriverProfile);
router.put("/edit/:driver_id", updateDriverInfo);

module.exports = router;
