import React, { useState } from "react";
import "./EditSchedule.css";

export default function EditSchedule({ schedule, onBack, onUpdate }) {
  const [updatedSchedule, setUpdatedSchedule] = useState({ ...schedule });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSchedule({ ...updatedSchedule, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedSchedule); // 👉 Gửi dữ liệu đã chỉnh sửa về ManageSchedule
  };

  return (
    <div className="edit-schedule-page">
      <h2>✏️ Chỉnh sửa lịch trình</h2>

      <form className="edit-schedule-form" onSubmit={handleSubmit}>
        <label>Mã số xe:</label>
        <input
          name="id"
          value={updatedSchedule.id}
          onChange={handleChange}
          readOnly
        />

        <label>Tài xế:</label>
        <input
          name="driver"
          value={updatedSchedule.driver}
          onChange={handleChange}
          required
        />

        <label>Giờ chạy:</label>
        <input
          name="time"
          value={updatedSchedule.time}
          onChange={handleChange}
          required
        />

        <label>Tuyến xe:</label>
        <input
          name="route"
          value={updatedSchedule.route}
          onChange={handleChange}
          required
        />

        <label>Ngày:</label>
        <input
          type="date"
          name="date"
          value={updatedSchedule.date}
          onChange={handleChange}
          required
        />

        <label>Trạng thái:</label>
        <select
          name="status"
          value={updatedSchedule.status}
          onChange={handleChange}
          required
        >
          <option value="Đang chạy">Đang chạy</option>
          <option value="Chờ khởi hành">Chờ khởi hành</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>

        <div className="btn-container">
          <button type="submit" className="save-btn">💾 Lưu</button>
          <button type="button" className="back-btn" onClick={onBack}>↩ Quay lại</button>
        </div>
      </form>
    </div>
  );
}
