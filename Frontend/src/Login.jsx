import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";
import "./App.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Mock dữ liệu tài khoản
  const users = {
    "admin@gmail.com": "admin",
    "driver@gmail.com": "driver",
    "parent@gmail.com": "parent",
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!users[email]) {
      alert("Tài khoản không hợp lệ");
      return;
    }

    if (password !== "123456") {
      alert("Sai mật khẩu");
      return;
    }

    // Đăng nhập thành công
    alert("Đăng nhập thành công");
    const role = users[email];

    // Điều hướng theo vai trò
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "driver":
        navigate("/driver");
        break;
      case "parent":
        navigate("/parent"); // ✅ Đã sửa lại đúng thư mục
        break;
      default:
        navigate("/");
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
          </div>
        </div>
      </div>
    </div>
  );
}
