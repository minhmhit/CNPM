import axios from "../util/axios.customize";

export const getScheduleByUserId = async (userId) => {
    try {
        const res = await axios.get(`/driver/schedules/${userId}`);
        return res;
    } catch (error) {
        throw error;
    }
};

export const getScheduleStudent = async (schedule_id) => {
    try {
        const res = await axios.get(`/schedule/students/${schedule_id}`);
        return res;
    } catch (error) {
        throw error;
    }
};

export const checkIn = async (data) => {
    try {
        const res = await axios.post(`/student/checkinStudent`, data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const checkOut = async (data) => {
    try {
        const res = await axios.post(`/student/checkoutStudent`, data);
        return res;
    } catch (error) {
        throw error;
    }
};
