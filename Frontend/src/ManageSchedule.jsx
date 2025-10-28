import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageSchedule.css";

export default function ManageSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    driver_id: "",
    bus_id: "",
    route_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/schedule/getAll");
      setSchedules(res.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi load dữ liệu:", error);
      alert("Không thể tải danh sách lịch trình!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lọc lịch trình theo ngày
  const fetchSchedulesByDate = async (date) => {
    try {
      if (!date) {
        fetchSchedules();
        return;
      }
      const res = await axios.get(`http://localhost:5000/api/v1/schedule/byDate/${date}`);
      setSchedules(res.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi lọc lịch trình:", error);
      alert("Không thể tải lịch trình theo ngày!");
    }
  };

  // ✅ Xóa lịch trình
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch trình này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/schedule/delete/${id}`);
      setSchedules((prev) => prev.filter((item) => item.schedule_id !== id));
      alert("Đã xóa lịch trình thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      alert("Không thể xóa lịch trình!");
    }
  };

  // ✅ Mở form thêm mới
  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingSchedule(null);
  };

  // ✅ Gửi request thêm mới
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/schedule/create", newSchedule);
      alert("Thêm lịch trình thành công!");
      setShowAddForm(false);
      setNewSchedule({ driver_id: "", bus_id: "", route_id: "", date: "", start_time: "", end_time: "" });
      fetchSchedules();
    } catch (error) {
      console.error("❌ Lỗi khi thêm lịch:", error);
      alert("Không thể thêm lịch trình!");
    }
  };

  // ✅ Bật chế độ chỉnh sửa
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowAddForm(false);
  };

  // ✅ Gửi request cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/v1/schedule/edit/${editingSchedule.schedule_id}`,
        editingSchedule
      );
      alert("Cập nhật lịch trình thành công!");
      setEditingSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("Không thể cập nhật lịch trình!");
    }
  };

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="manage-schedule">
      <h2>📋 Quản lý lịch trình xe buýt</h2>

      {/* Nút thêm lịch trình */}
      {!showAddForm && !editingSchedule && (
        <div className="add-schedule-container">
          <button className="add-btn" onClick={handleAddClick}>+ Thêm lịch trình</button>
        </div>
      )}

      {/* Bộ lọc theo ngày */}
      {!showAddForm && !editingSchedule && (
        <div className="filter-bar" style={{ marginBottom: "10px" }}>
          <label>📅 Chọn ngày: </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const date = e.target.value;
              setSelectedDate(date);
              fetchSchedulesByDate(date);
            }}
            style={{ margin: "0 10px", padding: "5px" }}
          />
          <button
            onClick={() => {
              setSelectedDate("");
              fetchSchedules();
            }}
            style={{ padding: "5px 10px" }}
          >
            Hiện tất cả
          </button>
        </div>
      )}

      {/* Form thêm mới */}
      {showAddForm && (
        <form className="schedule-form" onSubmit={handleAddSchedule}>
          <h3>➕ Thêm lịch trình mới</h3>
          <input
            type="number"
            placeholder="Driver ID"
            value={newSchedule.driver_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, driver_id: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Bus ID"
            value={newSchedule.bus_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, bus_id: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Route ID"
            value={newSchedule.route_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, route_id: e.target.value })}
            required
          />
          <input
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
            required
          />
          <input
            type="time"
            value={newSchedule.start_time}
            onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
            required
          />
          <input
            type="time"
            value={newSchedule.end_time}
            onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
            required
          />
          <div className="form-actions">
            <button type="submit" className="save-btn">Lưu</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Hủy</button>
          </div>
        </form>
      )}

      {/* Form chỉnh sửa */}
      {editingSchedule && (
        <form className="schedule-form" onSubmit={handleUpdate}>
          <h3>✏️ Chỉnh sửa lịch trình #{editingSchedule.schedule_id}</h3>
          <input
            type="number"
            placeholder="Driver ID"
            value={editingSchedule.driver_id}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, driver_id: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Bus ID"
            value={editingSchedule.bus_id}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, bus_id: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Route ID"
            value={editingSchedule.route_id}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, route_id: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={editingSchedule.date ? editingSchedule.date.slice(0, 10) : ""}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, date: e.target.value })
            }
            required
          />
          <input
            type="time"
            value={editingSchedule.start_time}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, start_time: e.target.value })
            }
            required
          />
          <input
            type="time"
            value={editingSchedule.end_time}
            onChange={(e) =>
              setEditingSchedule({ ...editingSchedule, end_time: e.target.value })
            }
            required
          />
          <div className="form-actions">
            <button type="submit" className="save-btn">Cập nhật</button>
            <button type="button" onClick={() => setEditingSchedule(null)}>Hủy</button>
          </div>
        </form>
      )}

      {/* Bảng hiển thị lịch trình */}
      {!showAddForm && !editingSchedule && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Xe</th>
              <th>Tài xế</th>
              <th>Tuyến</th>
              <th>Ngày</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((item) => (
                <tr key={item.schedule_id}>
                  <td>{item.schedule_id}</td>
                  <td>{item.bus_id}</td>
                  <td>{item.driver_id}</td>
                  <td>{item.route_id}</td>
                  <td>{new Date(item.date).toLocaleDateString("vi-VN")}</td>
                  <td>{item.start_time}</td>
                  <td>{item.end_time}</td>
                  <td>{item.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(item.schedule_id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>Không có lịch trình nào!</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
