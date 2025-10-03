import { Link } from "react-router-dom";
import background from "./pics/backgroud.png";
import logo from "./pics/logo.png";
import "./App.css";
import "./Driver.css";
import accountIcon from "./pics/account-icon.png";
export default function Driver() {
    return (
        <div className="app">
            <div className="navbar">
                <div className="navbar-left">
                    <img src={logo} className="bus-icon" />
                    <span className="navbar-title">Bus map</span>
                </div>
                <div className="account-info">
                    <img src={accountIcon}></img>
                    <span>Xin chào, Tài xế</span>
                </div>
            </div>

            <div className="center-box">
                <div className="display-info">A</div>
                <div className="side-panel">
                    <button className="side-button">Xem lịch làm việc</button>
                    <button className="side-button">Xem danh sách học sinh</button>
                    <button className="side-button">Báo cáo tình trạng</button>
                    <button className="side-button">Gửi cảnh báo sự cố</button>
                    <button className="side-button">Hiện map</button>
                    <div className="logout-button"><button>Đăng xuất</button></div>
                </div>

            </div>
        </div>
    );
}

