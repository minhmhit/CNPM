const schedule = require ('../Models/schedule.model');
const createSchedule = async (scheduleData) => {
    try {
        let result = await schedule.createSchedule(scheduleData);
        return result;
    } catch (error) {
        throw error;
    }
};
const updateSchedule = async (schedule_id, scheduleData) => {
    try {
        let result = await schedule.updateSchedule(schedule_id, scheduleData);
        return result;
    } catch (error) {
        throw error;
    }
};
const deleteSchedule = async (schedule_id) => {
    try {
        let result = await schedule.deleteSchedule(schedule_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const getDriverSchedule = async (driver_id) => {
    try {
        let result = await schedule.getDriverSchedule(driver_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const getBusSchedule = async (bus_id) => {
    try {
        let result = await schedule.getBusSchedule(bus_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const getStudentSchedule = async (student_id) => {
    try {
        let result = await schedule.getStudentSchedule(student_id);
        return result;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getDriverSchedule,
    getBusSchedule,
    getStudentSchedule
};