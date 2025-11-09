import axios from "../util/axios.customize.js"

export const fetchStudents = async (schedule_id) => {
    try {
        const res = await axios.get(`/schedule/students/${schedule_id}`);
        console.log(res.data.data)
        return res.data.data
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
};

export const fetchSchedules = async () => {
    try {
        const userid = localStorage.getItem("userId");
        const res = await axios.get(`/driver/schedules/${userid}`);
        console.log(res.data.data)
        return res.data.data
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
};

export const checkInAPI = async (schedule_id, student_id) => {
  try {
   
    const res = await axios.post("/student/checkinStudent", { schedule_id, student_id });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi checkin:", err);
  }
};

export const checkOutAPI = async (schedule_id, student_id) => {
    try {
        const res = await axios.post("/student/checkoutStudent", { schedule_id, student_id });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi checkout:", err);
    }
};

export const markAbsentAPI = async (student_id, schedule_id) => {
    try {
        const res = await axios.post("/student/onLeaveStudent", { schedule_id, student_id });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi absent:", err);
    }
}