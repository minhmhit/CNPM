const attendance = require ("../Models/attendance.model");

const checkin = async (student_id, route_id, timestamp) => {
    try {
        await attendance.checkin(student_id, route_id, timestamp);
    } catch (error) {
        console.error("Error during check-in:", error);
        throw error;
    }
};
const checkout = async (student_id, route_id, timestamp) => {
    try {
        await attendance.checkout(student_id, route_id, timestamp); 
    } catch (error) {
        console.error("Error during check-out:", error);
        throw error;
    }
};

const getStudentAttendance = async (student_id) => {
    try {
        return await attendance.getStudentAttendance(student_id);
    } catch (error) {
        console.error("Error getting student attendance:", error);
        throw error;
    }
};

const getRouteAttendance = async (route_id) => {
    try {
        return await attendance.getRouteAttendance(route_id);
    } catch (error) {
        console.error("Error getting route attendance:", error);
        throw error;
    }
};

module.exports = {
    checkin,
    checkout,
    getStudentAttendance,
    getRouteAttendance
};
