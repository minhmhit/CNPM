import axios from "../util/axios.customize";

export const sendMessage = async (payload) => {
  try {
    const url = `/notification/create`;
    const res = await axios.post(url, payload);
    return res.data;   // Trả về data từ backend
  } catch (error) {
    console.error("Error sending message:", error);
    return error.response || null;  // Tránh null gây lỗi
  }
};
