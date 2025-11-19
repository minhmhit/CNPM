import axios from "../util/axios.customize";

export const getAllRoutes = async () => {
  try {
    const res = await axios.get("/route/getAll");
    return res;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return null;
  }
};
