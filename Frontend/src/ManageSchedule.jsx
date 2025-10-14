import React, { useState } from "react";
import "./ManageSchedule.css";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";

export default function ManageSchedule() {
  const [showAddPage, setShowAddPage] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [schedules, setSchedules] = useState([
    { id: "51A-12345", driver: "Nguyễn Văn A", time: "07:00 - 08:00", route: "Bến xe Miền Đông → ĐH Sài Gòn", date: "2025-10-04", status: "Đang chạy" },
    { id: "51B-67890", driver: "Trần Văn B", time: "08:30 - 09:30", route: "ĐH Sài Gòn → Bến xe Miền Tây", date: "2025-10-04", status: "Chờ khởi hành" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm(`Xóa xe ${id}?`)) {
      setSchedules(schedules.filter((item) => item.id !== id));
    }
  };

  const handleAdd = () => setShowAddPage(true);
  const handleBack = () => {
    setShowAddPage(false);
    setEditingSchedule(null);
  };

  const handleAddSchedule = (newSchedule) => {
    setSchedules([...schedules, newSchedule]);
    setShowAddPage(false);
  };

  // 👉 Khi bấm “Sửa”
  const handleEdit = (id) => {
    const scheduleToEdit = schedules.find((item) => item.id === id);
    setEditingSchedule(scheduleToEdit);
  };

  // 👉 Khi lưu chỉnh sửa
  const handleUpdateSchedule = (updatedSchedule) => {
    setSchedules(
      schedules.map((item) =>
        item.id === updatedSchedule.id ? updatedSchedule : item
      )
    );
    setEditingSchedule(null);
  };

  // 👉 Nếu đang thêm mới
  if (showAddPage) {
    return <AddSchedule onBack={handleBack} onAdd={handleAddSchedule} />;
  }

  // 👉 Nếu đang chỉnh sửa
  if (editingSchedule) {
    return (
      <EditSchedule
        schedule={editingSchedule}
        onBack={handleBack}
        onUpdate={handleUpdateSchedule}
      />
    );
  }

  return (
    <div className="manage-schedule">
      <h2>📋 Quản lý lịch trình xe</h2>

      <table>
        <thead>
          <tr>
            <th>Mã số xe</th>
            <th>Tài xế</th>
            <th>Giờ chạy</th>
            <th>Tuyến xe</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.driver}</td>
              <td>{item.time}</td>
              <td>{item.route}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item.id)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-schedule-container">
        <button className="add-btn" onClick={handleAdd}>+ Thêm lịch trình</button>
      </div>
    </div>
  );
}
