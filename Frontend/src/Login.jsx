import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";
import "./App.css";
import { toast } from 'react-toastify';
import axios from "axios";
import api from "./util/axios.customize.js";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /***
   * tạo data account mẫu để test
   */
  const register = async (e) => {
    e.preventDefault();
    try {
      const username = "driver100";
      const role = "driver";
      const email = "driver2000@gmail.com";
      const password = "123456789";

      await axios.post(
        "http://localhost:5000/api/v1/user/register",
        {
          username,
          email,
          password,
          role,
        }
      );
      toast.info("Tạo tài khoản test thành công! Email: driver2000@gmail.com, Pass: 123456789", { position: "top-center", autoClose: 5000 });
    } catch (error) {
      console.log("create account error", error);
      let errorMessage = error.response?.data?.message || "Lỗi tạo tài khoản";
      toast.error(`❌ Lỗi: ${errorMessage}`, { position: "top-center" });
    }
  }

  // Logic Đăng nhập chính
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const response = await axios.post(
      //   "http://localhost:5000/api/v1/user/login",
      //   {
      //     email,
      //     password,
      //   }
      // );

      const response = await api.post("http://localhost:5000/api/v1/user/login",
        {
          email,
          password,
        }
      )

      // Trích xuất dữ liệu
      const { userid, role, username } = response.data.data.result;
      const { accessToken } = response.data.data;

      // Lưu thông tin vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userid);

      // Hiển thị Toast thông báo thành công
      toast.success(`👋 Chào mừng ${username}! Đăng nhập thành công.`, {
        position: "top-center",
        autoClose: 1000,
      });

      setTimeout(() => {
        setIsLoading(false);
        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "driver":
            navigate("/driver");
            break;
          case "student":
            navigate("/parents");
            break;
          default:
            navigate("/");
        }
      }, 1200);
    } catch (error) {
      console.error("Login failed:", error);

      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại Email và Mật khẩu.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(`❌ Lỗi: ${errorMessage}`, {
        position: "top-center",
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  const renderLoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <FaBus className="loading-bus-icon" />
          <p>Đang xác thực, chờ chút nhé...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <FaBus className="bus-icon" />
          <span className="navbar-title">Bus map</span>
        </div>
      </div>

      <div className="center-box">
        <div className="login-page">
          <div className="login-box">
            <div className="login-header">
              <div className="header-left">
                <FaBus className="bus-icon" />
                <span>Đăng Nhập</span>
              </div>
              <IoMdClose
                className="close-icon"
                onClick={() => navigate("/")}
              />
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <label>Email</label>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Tên đăng nhập"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <label>Password</label>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="login-links">
              <a href="#">Quên mật khẩu</a>
            </div>
          </div>
        </div>
      </div>
      {/* Hiển thị Loading Overlay */}
      {renderLoadingOverlay()}
    </div>
  );
}