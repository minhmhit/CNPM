import { Link } from "react-router-dom";
import background from "./pics/backgroud.png";
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
        <Link to="/login">
          <button className="login-btn">Đăng nhập</button>
        </Link>
        <Link to="/driver">
          <button className="login-btn">Tai xe</button>
        </Link>
      </div>

      <div className="center-box">
        <img src={background} className="logo" />
      </div>
    </div>
  );
}

