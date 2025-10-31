import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [showingDetailId, setShowingDetailId] = useState(null);

  // ✅ Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/schedule/getAll");
      // Đảm bảo dữ liệu ngày tháng đúng định dạng cho input date nếu cần
      const formattedSchedules = (res.data || []).map(schedule => ({
          ...schedule,
          // Ví dụ: chỉ lấy phần ngày nếu API trả về timestamp
          date: schedule.date ? schedule.date.slice(0, 10) : ""
      }));
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error("❌ Lỗi khi load dữ liệu:", error);
      // 🔄 Thay thế alert
      toast.error("Không thể tải danh sách lịch trình!");
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
      const formattedSchedules = (res.data || []).map(schedule => ({
          ...schedule,
          date: schedule.date ? schedule.date.slice(0, 10) : ""
      }));
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error("❌ Lỗi khi lọc lịch trình:", error);
      // 🔄 Thay thế alert
      toast.error("Không thể tải lịch trình theo ngày!");
    }
  };

  // ✅ Xóa lịch trình
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch trình này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/schedule/delete/${id}`);
      setSchedules((prev) => prev.filter((item) => item.schedule_id !== id));
      // 🔄 Thay thế alert
      toast.success("Đã xóa lịch trình thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      // 🔄 Thay thế alert
      toast.error("Không thể xóa lịch trình!");
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
      // 🔄 Thay thế alert
      toast.success("Thêm lịch trình thành công!");
      setShowAddForm(false);
      setNewSchedule({ driver_id: "", bus_id: "", route_id: "", date: "", start_time: "", end_time: "" });
      fetchSchedules();
    } catch (error) {
      console.error("❌ Lỗi khi thêm lịch:", error);
      // 🔄 Thay thế alert
      toast.error("Không thể thêm lịch trình!");
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
      // 🔄 Thay thế alert
      toast.success("Cập nhật lịch trình thành công!");
      setEditingSchedule(null);
      fetchSchedules();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      // 🔄 Thay thế alert
      toast.error("Không thể cập nhật lịch trình!");
    }
  };

  // 🆕 Hàm toggle hiển thị chi tiết
  const handleToggleDetail = (id) => {
    setShowingDetailId(id === showingDetailId ? null : id);
  };

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="manage-schedule">
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />

      <h2>📋 Quản lý lịch trình xe buýt</h2>

      {/* ... Phần còn lại của component không thay đổi ... */}
      
      {/* Nút thêm lịch trình */}
      {!showAddForm && !editingSchedule && (
        <div className="add-schedule-container">
          {/* Đã đổi tên class nút để tránh xung đột nếu có */}
          <button className="ms-add-btn" onClick={handleAddClick}>+ Thêm lịch trình</button>
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
              <th>Hành động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((item) => (
                <React.Fragment key={item.schedule_id}>
                  {/* Hàng chính (dạng rút gọn) */}
                  <tr>
                    <td>{item.schedule_id}</td>
                    <td>{item.bus_id}</td>
                    <td>{item.driver_id}</td>
                    <td>{item.route_id}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.schedule_id)}>Xóa</button>
                    </td>
                    {/* Nút Chi tiết/Ẩn chi tiết */}
                    <td>
                      <button 
                        className="detail-btn"
                        onClick={() => handleToggleDetail(item.schedule_id)}
                      >
                        {item.schedule_id === showingDetailId ? 'Ẩn chi tiết' : 'Chi tiết'}
                      </button>
                    </td>
                  </tr>

                  {/* Hàng chi tiết (ẩn/hiện) */}
                  {item.schedule_id === showingDetailId && (
                    <tr className="detail-row">
                      <td colSpan="6">
                        <div className="detail-content">
                          <p><strong>Ngày:</strong> {item.date ? new Date(item.date).toLocaleDateString("vi-VN") : 'N/A'}</p>
                          <p><strong>Giờ Bắt Đầu:</strong> {item.start_time}</p>
                          <p><strong>Giờ Kết Thúc:</strong> {item.end_time}</p>
                          <p><strong>Trạng Thái:</strong> {item.status}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>Không có lịch trình nào!</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}