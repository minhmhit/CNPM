import axios from "../util/axios.customize";

export const getAllUsers = async () => {
  try {
    let url = `/admin/getAllUsers`;
    const res = await axios.get(url);
    const users = res.data.data || res.data; // Lọc theo danh mục
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
    let url = `/bus/`;
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
