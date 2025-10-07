import { SidePanel, Navbar } from "./Driver.jsx"
import React, {useState} from "react"
import "./Report.css"

export default function Alert(){

    const currentDriver = { id: 1, name: "Nguyễn Văn Tài"}; // mock data tài xế hiện hành
    const currentSchedule = {id: 5} //mock data ca hiện hành

    const [reportData, setReportData] = useState({
        driver: currentDriver.name,
        schedule_id: currentSchedule.id,
        type: "incident",
        description: "",
        time: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReportData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Tự động thêm thời gian gửi
        const sendTime = new Date().toLocaleString();
        const finalReport = { ...reportData, time: sendTime};

        const confirmSend = window.confirm(
        `Xác nhận gửi cảnh báo?\n\nNgười gửi: ${finalReport.driver}\nCa ID: ${finalReport.schedule_id}\nLoại: ${finalReport.type}\nThời gian: ${finalReport.time}`
        );

        if (confirmSend) {
        alert("Đã gửi cảnh báo thành công!");
        } else {
        alert("Đã hủy gửi cảnh báo.");
        }
    };

    return (
        <div className="app">
            <Navbar />
            <div className="driver-center-box">
                <div className="driver-display-info">
                    <div className="driver-report-container">
                        <h2 className="driver-report-title">Gửi cảnh báo lên hệ thống</h2>
                            <form className="driver-report-form" onSubmit={handleSubmit}>
                                {/* Người gửi */}
                                <div className="driver-form-group">
                                <label>Người gửi:</label>
                                <input type="text" value={reportData.driver} disabled />
                                </div>
                                {/* Mô tả */}
                                <div className="driver-form-group">
                                <label>Mô tả chi tiết:</label>
                                <textarea
                                    name="description"
                                    rows="6"
                                    value={reportData.description}
                                    onChange={handleChange}
                                    placeholder="Nhập nội dung cảnh báo..."
                                    required
                                ></textarea>
                                </div>

                                {/* Nút gửi */}
                                <button type="submit" className="driver-submit-btn">
                                Gửi cảnh báo ⚠️
                                </button>
                            </form>
                    </div>
                </div>
                <SidePanel />
            </div>
        </div>
    )
}