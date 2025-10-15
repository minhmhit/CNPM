import { SidePanel, Navbar } from "./Driver.jsx"
import "./Schedule.css"
import React, {useState} from "react";

function GetDayofWeek(dateString){
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const date = new Date(dateString);
    return days[date.getDay()];
}

export default function Schedule(){

    //Mock data
    const schedules = [
    // ======= Thứ 2 (Monday) =======
    // Buổi sáng: Trường -> A -> B -> Trường
    {
        schedule_id: 1,
        route_id: 101,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06", // Thứ 2
        start_time: "06:00",
        end_time: "06:15",
        stop_at: "Trạm A",
        status: "scheduled",
    },
    {
        schedule_id: 2,
        route_id: 101,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "06:20",
        end_time: "06:30",
        stop_at: "Trạm B",
        status: "scheduled",
    },
    {
        schedule_id: 3,
        route_id: 101,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "06:35",
        end_time: "06:45",
        stop_at: "Trường",
        status: "scheduled",
    },

    // Buổi trưa: Trường -> A -> B -> Trường
    {
        schedule_id: 4,
        route_id: 102,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "10:30",
        end_time: "10:45",
        stop_at: "Trạm A",
        status: "scheduled",
    },
    {
        schedule_id: 5,
        route_id: 102,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "10:50",
        end_time: "11:00",
        stop_at: "Trạm B",
        status: "scheduled",
    },
    {
        schedule_id: 6,
        route_id: 102,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "11:05",
        end_time: "11:15",
        stop_at: "Trường",
        status: "scheduled",
    },

    // Buổi chiều: Trường -> C -> Trường
    {
        schedule_id: 7,
        route_id: 103,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "17:30",
        end_time: "17:40",
        stop_at: "Trạm C",
        status: "scheduled",
    },
    {
        schedule_id: 8,
        route_id: 103,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-06",
        start_time: "17:45",
        end_time: "17:55",
        stop_at: "Trường",
        status: "scheduled",
    },

    // ======= Thứ 3 (Tuesday) =======
    // Sáng: Trường -> B -> Trường
    {
        schedule_id: 9,
        route_id: 104,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-07",
        start_time: "06:00",
        end_time: "06:10",
        stop_at: "Trạm B",
        status: "scheduled",
    },
    {
        schedule_id: 10,
        route_id: 104,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-07",
        start_time: "06:15",
        end_time: "06:25",
        stop_at: "Trường",
        status: "scheduled",
    },

    // ======= Thứ 4 (Wednesday) =======
    // Chiều: Trường -> C -> Trường
    {
        schedule_id: 11,
        route_id: 105,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-08",
        start_time: "17:30",
        end_time: "17:40",
        stop_at: "Trạm C",
        status: "scheduled",
    },
    {
        schedule_id: 12,
        route_id: 105,
        bus_id: 1,
        driver_id: 1,
        date: "2025-10-08",
        start_time: "17:45",
        end_time: "17:50",
        stop_at: "Trường",
        status: "scheduled",
    },
    ];

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
                                <th>Bus ID</th>
                                <th>Tài xế ID</th>
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
                                <th>Điểm dừng</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* {schedules.map((item) => (
                                <tr key={item.schedule_id}>
                                    <td>{item.schedule_id}</td>
                                    <td>{item.bus_id}</td>
                                    <td>{item.driver_id}</td>
                                    <td>{GetDayofWeek(item.date)}</td>
                                    <td>{item.date}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.end_time}</td>
                                    <td>{item.stop_at}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))} */}

                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((item) => (
                                        <tr key={item.schedule_id}>
                                            <td>{item.schedule_id}</td>
                                            <td>{item.bus_id}</td>
                                            <td>{item.driver_id}</td>
                                            <td>{GetDayofWeek(item.date)}</td>
                                            <td>{item.date}</td>
                                            <td>{item.start_time}</td>
                                            <td>{item.end_time}</td>
                                            <td>{item.stop_at}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                    ))
                                ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center" }}>
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
        </div>
    )
}