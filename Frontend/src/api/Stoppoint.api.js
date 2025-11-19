import axios from "../util/axios.customize";

export const getStopPointsByRouteId = async (routeId) => {
  try {
    const res = await axios.get(`/route/${routeId}/stoppoints`);
    return res;
  } catch (error) {
    console.error("Error fetching stop points:", error);
    return null;
  }
};
