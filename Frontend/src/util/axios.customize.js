import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 100000,
});

// ✅ Request Interceptor – gắn token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor – xử lý 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      console.log("Token expired or invalid");
      // Optionally: logout
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
