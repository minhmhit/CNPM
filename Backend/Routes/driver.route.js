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
const { authMiddleware, isDriver, isAdmin } = require("../middlewares/auth.middleware");
router.use(authMiddleware);
router.get("/profile/:userid", isDriver, getMyProfile);
router.put("/editinfo", isDriver, updateDriverInfo);
router.get("/schedules/:userid", isDriver, getMySchedules);
router.get("/sessions/:userid", isDriver, getMySessions);
router.get("/students/:userid", isDriver, getMyStudents);
router.get("/location/:userid", isDriver, getMyLocation);
router.put("/session/start", isDriver, startSession);
router.put("/session/:session_id/end", isDriver, endSession);
router.put("/update/location", isDriver, updateLocation);
router.post("/attendance", isDriver, markAttendance);
// Routes cho admin quản lý tài xế

router.get("/:driver_id", isAdmin, getDriverProfile);
router.put("/edit/:driver_id", isAdmin, updateDriverInfo);

module.exports = router;
