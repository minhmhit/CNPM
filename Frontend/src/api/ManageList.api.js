import axios from "../util/axios.customize";

export const getAllUsers = async () => {
  try {
    let url = `/admin/getAllUsers`;
    const res = await axios.get(url);
    const users = res.data.data || res.data;
    return users;

  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const addNew = async (url, payload) => {
  try {
    const res = await axios.post(url, payload);
    return res.data;
  } catch (error) {
    console.error("Error adding new item:", error);
    return null;
  }
};

export const deleteItem = async (url) => {
  try {
    const res = await axios.delete(url);
    return res;
  } catch (error) {
    console.error("Error deleting item:", error);
    return null;
  }
};

export const getAllBuses = async () => {
  try {
    let url = `/bus/getallbus`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.error("Error fetching buses:", error);
    return [];
  }
};

export const getAllRoutes = async () => {
  try {
    let url = `/route/getAllRoutes`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
};

export const getAllStudents = async () => {
  try {
    let url = `/admin/getAllStudents`;
    const res = await axios.get(url);
    const students = res.data.data || res.data;
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

export const getAllDrivers = async () => {
  try {
    let url = `/admin/getAllDrivers`;
    const res = await axios.get(url);
    // console.log("Response from getAllDrivers:", res.data);
    const drivers = res.data.data || res.data;
    return drivers;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};
