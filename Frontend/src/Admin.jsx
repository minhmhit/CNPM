import { Link } from "react-router-dom";
import background from "./pics/backgroud.png";
import logo from "./pics/logo.png";
import "./App.css";
import "./Admin.css";
import accountIcon from "./pics/account-icon.png";
export default function Admin() {
    return (
        <div className="app">
            <div className="navbar">
                <div className="navbar-left">
                    <img src={logo} className="bus-icon" />
                    <span className="navbar-title">Bus map</span>
                </div>
                <div className="account-info">
                    <img src={accountIcon}></img>
                    <span>Xin chào, Quản lý</span>
                </div>
            </div>

            <div className="center-box">
                <div className="display-info">A</div>
                <div className="side-panel">
                    <button className="side-button">Quản lý lịch trình xe</button>
                    <button className="side-button">Phân công tài xế xe</button>
                    <button className="side-button">Theo dõi vị trí xe</button>
                    <button className="side-button">Gửi tin nhắn</button>
                    <button className="side-button">Quản lý danh sách</button>
                    <div className="logout-button"><button>Đăng xuất</button></div>
                </div>

            </div>
        </div>
    );
}

