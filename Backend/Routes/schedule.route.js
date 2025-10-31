const express = require('express');
const router = express.Router();
const {
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
} = require("../Controllers/schedule.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");
router.use(authMiddleware);
router.use(isAdmin);
router.post('/create', createSchedule);
router.put('/edit/:schedule_id', updateSchedule);
router.delete('/delete/:schedule_id', deleteSchedule);
router.get('/driver/:driver_id', getDriverSchedule);
router.get('/bus/:bus_id', getBusSchedule);
//add student to schedule
router.post('/addStudent', addStudentToSchedule);
router.post('/addMultipleStudents', addMultipleStudentsToSchedule);
router.delete('/removeStudent', removeStudentFromSchedule);
//lấy danh sách học sinh theo lịch trình
router.get('/students/:schedule_id', getStudentsBySchedule);
router.put('/pickup', updatePickupStatus);
router.put('/dropoff', updateDropoffStatus);
router.get("/getall", getAllSchedule);
module.exports = router;