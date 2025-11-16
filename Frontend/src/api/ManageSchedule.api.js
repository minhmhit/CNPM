import axios from "../util/axios.customize";

export const getAllSchedules = async () => {
  try {
    const res = await axios.get("/schedule/getall");
    return res;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return null;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    const res = await axios.delete(`/schedule/delete/${scheduleId}`);
    return res;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return null;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const res = await axios.post("/schedule/create", scheduleData);
    return res;
  } catch (error) {
    console.error("Error creating schedule:", error);
    return null;
  }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const res = await axios.put(`/schedule/edit/${scheduleId}`, scheduleData);
    return res;
  } catch (error) {
    console.error("Error updating schedule:", error);
    return null;
  }
};

export const getDriverSchedules = async (driverId) => {
  try {
    const res = await axios.get(`/schedule/driver/${driverId}`);
    // console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching driver schedules:", error);
    return [];
  }
};
