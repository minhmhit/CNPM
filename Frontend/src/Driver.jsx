import { data, Link, NavLink } from "react-router-dom";
import background from "./pics/backgroud.png";
import logo from "./pics/logo.png";
import "./App.css";
import "./Driver.css";
import accountIcon from "./pics/account-icon.png";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiAlignCenter } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api/v1";

async function fetchDriver() {
  try {
    const token = localStorage.getItem("accessToken"); // lấy token từ localStorage
    console.log(token)
    const url = `${API_BASE}/driver/profile`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}` // gửi token cho backend
      }
    });
    return res.data.data;   // dữ liệu từ backend
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
  }
}

export default function Driver() {

    const [currentDriver, setDriver] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone_number: "", email: "" });

    useEffect(() => {
        fetchDriver().then(data => {
            setDriver(data);
            setFormData({
                name: data?.name || "",
                phone_number: data?.phone_number || "",
                email: data?.email || ""
            });
        });
    }, []);

    const handleEditClick = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${API_BASE}/driver/edit/${currentDriver.driver_id}`;
            await axios.put(url, formData);
            setDriver({ ...currentDriver, ...formData }); // cập nhật lại state
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            alert("Cập nhật thất bại!");
        }
    };

    if (!currentDriver) return <p>Đang tải dữ liệu...</p>;

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
                        onEditClick={handleEditClick}
                    />
                    {isEditing && (
                        <div className="edit-form-overlay">
                            <div className="edit-form">
                                <h3 style={{textAlign: "center"}}>Chỉnh sửa thông tin</h3>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="hidden"
                                        name="status"
                                        value={currentDriver.status}
                                    />
                                    <label htmlFor="name">Tên: </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Họ và tên"
                                    />
                                    <label htmlFor="phone_number">Số điện thoại: </label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="Số điện thoại"
                                    />
                                    <label htmlFor="email">Email: </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                    <div className="edit-buttons">
                                        <button type="submit">Lưu</button>
                                        <button type="button" onClick={handleCancel}>Hủy</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
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
                <h2 className="driverCard-name">Họ và tên: {props.name}
                    <span 
                      id="editProfile" 
                      style={{cursor: "pointer", marginLeft: "20px"}} 
                      onClick={props.onEditClick}
                    >
                      ✏️
                    </span></h2>
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
            <NavLink to="/driver/session" className="side-button">
                Xem phiên làm việc
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