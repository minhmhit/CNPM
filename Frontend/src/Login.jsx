import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";
import "./App.css";

import axios from "axios";
import api from "./util/axios.customize.js";



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        {
          username,
          email,
          password,
          role,
        }
      );
      if(res){
        console.log("create account success", res.data);
      }
    } catch (error) {
      console.log ("create account error", error);
      
    }
  }
  
  //get data frome backend
  // Lấy data từ backend
  const handleLogin = async (e) => {
    e.preventDefault();
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

      // Lấy role từ cấu trúc data đúng
      const { userid , role, username,} = response.data.data.result;
      const { accessToken } = response.data.data;
      console.log("Access Token:", accessToken);
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userid);
      //show toast success

      // alert("Đăng nhập thành công");

      // Redirect dựa trên role
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
    } catch (error) {
      console.error("Login failed:", error);

      // Hiển thị lỗi cụ thể nếu có
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Đăng nhập thất bại");
      }
    }
  };

 
  return (
    <div className="app">
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
                onClick={() => navigate("/")} // bấm X về Home
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
                />
              </div>

              <label>Password</label>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>

              <button type="submit" className="login-btn">
                Đăng nhập
              </button>
            </form>

            <div className="login-links">
              <a href="#">Quên mật khẩu</a>
            </div>
            <button onClick={register}>tạo tài khoản test</button>
          </div>
        </div>
      </div>
    </div>
  );
}
