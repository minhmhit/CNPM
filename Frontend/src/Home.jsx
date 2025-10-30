import { Link } from "react-router-dom";
import logo from "./pics/logo.png";
import "./App.css";
export default function Home() {
  return (
    <div className="app">
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} className="bus-icon" />
          <span className="navbar-title">Bus map</span>
        </div>
        <Link to="/login" className="login-btn">
          Đăng nhập
        </Link>
      </div>

      <div className="center-box">
      </div>
    </div>
  );
}

