import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 100000, // Thời gian chờ tối đa cho mỗi request (100 giây)
});

// Cấu hình request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy access token từ localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Thêm token vào header Authorization
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Bạn có thể thêm các header khác nếu cần, ví dụ: Content-Type
    // config.headers['Content-Type'] = 'application/json';

    return config;
  },
  (error) => {
    api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Xử lý refresh token hoặc logout
      console.log('Token expired, refreshing...');
    }
    return Promise.reject(error);
  }
);
    // Xử lý lỗi nếu có
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Xử lý refresh token hoặc logout
      console.log("Token expired, refreshing...");
    }
    return Promise.reject(error);
  }
);

// Export instance để dùng ở các nơi khác
export default api;
