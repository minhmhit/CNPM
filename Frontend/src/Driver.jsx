import { Link, NavLink } from "react-router-dom";
import background from "./pics/backgroud.png";
import logo from "./pics/logo.png";
import "./App.css";
import "./Driver.css";
import accountIcon from "./pics/account-icon.png";

export default function Driver() {

    //mock data
    const currentDriver = {
        driver_id: "D001",
        name: "Nguyễn Văn Tài",
        phone_number: "09009123987",
        email: "driver@gmail.com",
        status: "active",
    }

    return (
        <div className="app">
            <Navbar />
            <div className="driver-center-box">
                <div className="driver-display-info">
                    <h1>Chào mừng đến với ứng dụng theo dõi xe buýt thông minh 🚌</h1>
                    <DriverCard
                        pic = {accountIcon}
                        id = {currentDriver.driver_id}
                        name = {currentDriver.name}
                        phoneNumber = {currentDriver.phone_number}
                        email = {currentDriver.email}
                        status = {currentDriver.status}
                    />
                </div>
                <SidePanel />
            </div>
        </div>
    );
}

function DriverCard(props){
    return(
        <div className="driver-card">
            <div className="driver-profile-pic">
                <img className="card-image" src={props.pic} alt="driver-image"/>
            </div>
            <div className="driver-info">
                <h2 className="driverCard-name">Họ và tên: {props.name}</h2>
                <hr></hr>
                <p className="driverCard-id">Số ID: {props.id}</p>
                <hr></hr>
                <p className="driverCard-phone">Số điện thoại: {props.phoneNumber}</p>
                <hr></hr>
                <p className="driverCard-email">Email: {props.email}</p>
                <hr></hr>
                <p className="driverCard-status">Tình trạng: {props.status}</p>
                <hr></hr>
            </div>
        </div>
    )
}

export function SidePanel(){
    return (
        <div className="driver-side-panel">
            <NavLink to="/driver/schedule" className="side-button">
                Xem lịch làm việc
            </NavLink>
            <NavLink to="/driver/student" className="side-button">
                Xem danh sách học sinh
            </NavLink>
            <NavLink to="/driver/report" className="side-button">
                Báo cáo tình trạng
            </NavLink>
            <NavLink to="/driver/alert" className="side-button">
                Gửi cảnh báo sự cố
            </NavLink>
            <NavLink to="/driver/map" className="side-button">
                Hiện map
            </NavLink>
            {/* <button className="side-button">Xem lịch làm việc</button>
            <button className="side-button">Xem danh sách học sinh</button>
            <button className="side-button">Báo cáo tình trạng</button>
            <button className="side-button">Gửi cảnh báo sự cố</button>
            <button className="side-button">Hiện map</button> */}
            <div className="logout-button"><button>Đăng xuất</button></div>
        </div>
    )
}

export function Navbar(){
    return (
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
    )
}