import React, { useState } from "react";
import "./AddSchedule.css";

export default function AddSchedule({ onBack, onAdd }) {
  const [schedule, setSchedule] = useState({
    id: "",
    driver: "",
    time: "",
    route: "",
    date: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(schedule); // 👉 Gọi hàm thêm lịch trình thật
  };

  return (
    <div className="add-schedule-page">
      <h2>🚌 Thêm lịch trình mới</h2>
      <form className="add-schedule-form" onSubmit={handleSubmit}>
        <label>Mã số xe:</label>
        <input name="id" value={schedule.id} onChange={handleChange} required />

        <label>Tài xế:</label>
        <input name="driver" value={schedule.driver} onChange={handleChange} required />

        <label>Giờ chạy:</label>
        <input name="time" value={schedule.time} onChange={handleChange} required />

        <label>Tuyến xe:</label>
        <input name="route" value={schedule.route} onChange={handleChange} required />

        <label>Ngày:</label>
        <input type="date" name="date" value={schedule.date} onChange={handleChange} required />

        <label>Trạng thái:</label>
        <select name="status" value={schedule.status} onChange={handleChange} required>
          <option value="">-- Chọn trạng thái --</option>
          <option value="Đang chạy">Đang chạy</option>
          <option value="Chờ khởi hành">Chờ khởi hành</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>

        <div className="btn-container">
          <button type="submit" className="submit-btn">Thêm</button>
          <button type="button" className="back-btn" onClick={onBack}>Quay lại</button>
        </div>
      </form>
    </div>
  );
}
