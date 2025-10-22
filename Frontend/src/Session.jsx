import { SidePanel, Navbar } from "./Driver.jsx"
import "./Session.css"
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

export default function Session(){
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    // Hàm fetch data
    const fetchSessions = async (date) => {
        try {
            const userid = localStorage.getItem("userId");
            let url = `${API_BASE}/driver/sessions/${userid}`;
            if (date) {
                url += `?date=${date}`;
            }
            const res = await axios.get(url);
            console.log("Sessions:", res.data.data);
            setSessions(res.data.data || []);  // ✅ cập nhật state
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchSessions(date); // ✅ gọi lại API
    };

    const handleStart = async (id) => {
        try {
            const res = await axios.put(`${API_BASE}/driver/session/start`, {
            session_id: id,
            });
            setSessions((prev) =>
            prev.map((s) =>
                s.session_id === id ? { ...s, status: "started" } : s
            )
            );
        } catch (err) {
            console.error("Lỗi khi bắt đầu session:", err);
        }
    };

    const handleEnd = async (id) => {
        try {
            const res = await axios.put(`${API_BASE}/driver/session/${id}/end`);
            setSessions((prev) =>
            prev.map((s) =>
                s.session_id === id ? { ...s, status: "completed" } : s
            )
            );
        } catch (err) {
            console.error("Lỗi khi kết thúc session:", err);
        }
    };

    return (
        <div className="app">
            <Navbar />
            <div className="driver-center-box">
                <div className="driver-display-info">
                    {/* Bộ chọn ngày */}
                    <div style={{ marginBottom: "5px" }}>
                        <label>Chọn ngày: </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>

                    {/* Bảng sessions */}
                    <table className="session-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Schedule ID</th>
                                <th>Ngày</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Tuyến</th>
                                <th>Xe</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>
                                        Không có phiên làm việc nào
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((s) => (
                                    <tr key={s.session_id}>
                                        <td>{s.session_id}</td>
                                        <td>{s.schedule_id}</td>
                                        <td>{new Date(s.date).toLocaleDateString()}</td>
                                        <td>{new Date(s.start_time).toLocaleTimeString()}</td>
                                        <td>{new Date(s.end_time).toLocaleTimeString()}</td>
                                        <td>{s.route_name}</td>
                                        <td>{s.license_plate} ({s.bus_model})</td>
                                        <td>{s.status}</td>
                                        <td>
                                            {/* Nếu session chưa bắt đầu */}
                                            {s.status === "active" && (
                                                <button 
                                                    onClick={() => handleStart(s.session_id)}
                                                    style={{
                                                        background: "#4caf50",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >Bắt đầu</button>
                                            )}

                                            {/* Nếu session đang chạy */}
                                            {s.status === "started" && (
                                                <button 
                                                    onClick={() => handleEnd(s.session_id)}
                                                    style={{
                                                        background: "#e53935",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >Kết thúc</button>
                                            )}
                                            {/* Nếu session đã kết thúc */}
                                            {s.status === "completed" && (
                                                <>
                                                <button
                                                    disabled
                                                    style={{
                                                        border: "none",
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        cursor: "not-allowed"
                                                    }}
                                                >Bắt đầu</button>
                                                <button 
                                                    disabled
                                                    style={{
                                                        border: "none",
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        cursor: "not-allowed"
                                                    }}
                                                >Kết thúc</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <SidePanel />
            </div>
        </div>
    );
}
