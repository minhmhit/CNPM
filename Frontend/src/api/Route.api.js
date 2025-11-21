import axios from "../util/axios.customize";

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
