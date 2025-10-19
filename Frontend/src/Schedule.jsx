import { SidePanel, Navbar } from "./Driver.jsx"
import "./Schedule.css"
import React, {useState} from "react";
import axios from "axios";
import { useEffect } from "react";

const API_BASE = "http://localhost:5000/api/v1";

async function fetchSchedules() {
    try {
        const userid = localStorage.getItem("userId")
        const url = `${API_BASE}/driver/schedules/${userid}`
        const res = await axios.get(url)
        console.log(res.data.data)
        return res.data.data
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
}

async function fetchStudent(schedule_id) {
    try {
        const token = localStorage.getItem("accessToken"); // lấy token từ localStorage
        const userid = localStorage.getItem("userId")
        const url = `${API_BASE}/driver/students/4`
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // gửi token cho backend
            }
        })
        console.log(res.data.data)
        return res.data.data
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
}

function GetDayofWeek(dateString){
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const date = new Date(dateString);
    return days[date.getDay()];
}

export default function Schedule(){

    //fetchStudent()

    const [schedules, setSchedules] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);



    useEffect(() => {
    fetchSchedules().then(data => {
        if (data) setSchedules(data);
    });
    }, []);

    //Xác định thứ hiện tại
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const today = days[new Date().getDay()]; //Mặc định là hôm nay
    const [selectedDay, setSelectedDay] = useState(today);
    const [showDropdown, setShowDropdown] = useState(false);

    //Lọc lịch trình theo thứ được chọn
    const filteredSchedules = schedules.filter(
        (s) => GetDayofWeek(s.date) === selectedDay
    );

    return(
        <div className="app">
            <Navbar />
            <div className="driver-center-box">
                <div className="driver-display-info">
                    <div className="schedule-container">
                        <h2>Lịch trình làm việc</h2>
                        <table className="schedule-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                {/* <th>Thứ</th> */}
                                <th
                                    className="clickable-th"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    {selectedDay} ▾
                                    {showDropdown && (
                                        <div className="day-dropdown">
                                            {days.map((d) => (
                                                <div
                                                    key={d}
                                                    className={`day-option ${
                                                        d === selectedDay ? "active" : ""
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedDay(d);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {d}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </th>
                                <th>Ngày</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((item) => (
                                <tr
                                    key={item.schedule_id}
                                    onClick={() => {
                                    setSelectedSchedule(item);
                                    setShowModal(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{item.schedule_id}</td>
                                    <td>{GetDayofWeek(item.date)}</td>
                                    <td>{item.date}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.end_time}</td>
                                    <td>{item.status}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Không có lịch làm việc cho {selectedDay}
                                </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <SidePanel />
            </div>
            {showModal && selectedSchedule && (
                <div className="driver-modal-overlay">
                    <div className="driver-modal-content">
                    <h2>Chi tiết lịch trình #{selectedSchedule.schedule_id}</h2>
                    <p><b>Ngày:</b> {selectedSchedule.date} ({GetDayofWeek(selectedSchedule.date)})</p>
                    <p><b>Thời gian:</b> {selectedSchedule.start_time} - {selectedSchedule.end_time}</p>
                    <p><b>Trạng thái:</b> {selectedSchedule.status}</p>
                    <hr />
                    <p><b>Tuyến:</b> {selectedSchedule.route_name} - {selectedSchedule.route_description}</p>
                    <p><b>Xe:</b> {selectedSchedule.bus_model} ({selectedSchedule.license_plate})</p>
                    <p><b>Sức chứa:</b> {selectedSchedule.capacity}</p>
                    <p><b>Số học sinh:</b> {selectedSchedule.student_count}</p>

                    <button 
                        onClick={() => setShowModal(false)} 
                        style={{
                        marginTop: "15px",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "5px",
                        background: "#007bff",
                        color: "white",
                        cursor: "pointer"
                        }}
                    >
                        Đóng
                    </button>
                    </div>
                </div>
                )}
        </div>
    )
}