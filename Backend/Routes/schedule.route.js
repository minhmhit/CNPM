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
} = require("../Controllers/schedule.controller");
router.post('/create', createSchedule);
router.put('/edit/:schedule_id', updateSchedule);
router.delete('/delete/:schedule_id', deleteSchedule);
router.get('/driver/:driver_id', getDriverSchedule);
router.get('/bus/:bus_id', getBusSchedule);
//add student to schedule
router.post('/:schedule_id/add-student', addStudentToSchedule);
router.post('/:schedule_id/add-multiple-students', addMultipleStudentsToSchedule);
router.delete('/:schedule_id/remove-student/:student_id', removeStudentFromSchedule);
//lấy danh sách học sinh theo lịch trình
router.get('/:schedule_id/students', getStudentsBySchedule);
router.put('/:schedule_id/pickup/:student_id', updatePickupStatus);
router.put('/:schedule_id/dropoff/:student_id', updateDropoffStatus);
module.exports = router;