const express = require('express');
const router = express.Router();
const {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getDriverSchedule,
    getBusSchedule,
    getStudentSchedule
} = require('../Controllers/schedule.controller');
router.post('/create', createSchedule);
router.put('/edit/:schedule_id', updateSchedule);
router.delete('/delete/:schedule_id', deleteSchedule);
router.get('/driver/:driver_id', getDriverSchedule);
router.get('/bus/:bus_id', getBusSchedule);
router.get('/student/:student_id', getStudentSchedule);
module.exports = router;