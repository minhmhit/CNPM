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
<<<<<<< Updated upstream
  getAllSchedule
=======
  getAllSchedules,
  getSchedulesByDate,
>>>>>>> Stashed changes
} = require("../Controllers/schedule.controller");
router.post('/create', createSchedule);
router.put('/edit/:schedule_id', updateSchedule);
router.delete('/delete/:schedule_id', deleteSchedule);

router.get('/driver/:driver_id', getDriverSchedule);
router.get('/bus/:bus_id', getBusSchedule);

//get schedules by date
router.get("/byDate/:date", getSchedulesByDate);


//get all schedules
router.get('/getAll', getAllSchedules);
//add student to schedule
router.post('/addStudent', addStudentToSchedule);
router.post('/addMultipleStudents', addMultipleStudentsToSchedule);
router.delete('/removeStudent', removeStudentFromSchedule);
//lấy danh sách học sinh theo lịch trình
router.get('/students/:schedule_id', getStudentsBySchedule);
router.put('/pickup', updatePickupStatus);
router.put('/dropoff', updateDropoffStatus);
<<<<<<< Updated upstream
router.get("/getall", getAllSchedule);
=======



>>>>>>> Stashed changes
module.exports = router;