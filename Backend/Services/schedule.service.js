const schedule = require ('../Models/schedule.model');

const getAllSchedules = async () => {
    try {
        let result = await schedule.getAllSchedules();
        return result;
    } catch (error) {
        throw error;
    }
};

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
const addStudentToSchedule = async (schedule_id, student_id) => {
    try {
        let result = await schedule.addStudentToSchedule(schedule_id, student_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const removeStudentFromSchedule = async (schedule_id, student_id) => {
    try {
        let result = await schedule.removeStudentFromSchedule(schedule_id, student_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const addMultipleStudentsToSchedule = async (schedule_id, student_ids) => {
    try {
        let result = await schedule.addMultipleStudentsToSchedule(schedule_id, student_ids);
        return result;
    } catch (error) {
        throw error;
    }
};
const getStudentsBySchedule = async (schedule_id) => {
    try {
        let result = await schedule.getStudentsBySchedule(schedule_id);
        return result;
    } catch (error) {
        throw error;
    }
};
const updateStudentPickupStatus = async (schedule_id, student_id, status) => {
    try {
        let result = await schedule.updateStudentPickupStatus(schedule_id, student_id, status);
        return result;
    } catch (error) {
        throw error;
    }
};
const updateStudentDropoffStatus = async (schedule_id, student_id, status) => {
    try {
        let result = await schedule.updateStudentDropoffStatus(schedule_id, student_id, status);
        return result;
    } catch (error) {
        throw error;
    }   
};
const checkStudentInSchedule = async (schedule_id, student_id) => {
    try {
        let result = await schedule.checkStudentInSchedule(schedule_id, student_id);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    addStudentToSchedule,
    removeStudentFromSchedule,
    addMultipleStudentsToSchedule,
    getStudentsBySchedule,
    updateStudentPickupStatus,
    updateStudentDropoffStatus,
    getBusSchedule,
    getDriverSchedule,
    checkStudentInSchedule,
    getAllSchedules
};