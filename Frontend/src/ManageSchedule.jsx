import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageSchedule.css";
import {
  getAllSchedules,
  deleteSchedule,
  createSchedule,
  updateSchedule,
} from "./api/ManageSchedule.api";
import { getAllBuses, getAllUsers, getAllRoutes } from "./api/ManageList.api";
import { FiSave, FiPlus, FiTrash2, FiSend, FiArrowLeft, FiEye, FiSmile } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

export default function ManageSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [originalSchedules, setOriginalSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showingDetailId, setShowingDetailId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    driver_id: "",
    bus_id: "",
    route_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  // PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchSchedules();
    fetchDrivers();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getAllSchedules();

      const formatted = (res?.data || [])
        .map((item) => ({
          ...item,
          date: item.date ? item.date.slice(0, 10) : "",
        }))
        .filter((item) => item.status !== "canceled");

      setSchedules(formatted);
      setOriginalSchedules(formatted);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách lịch trình!");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const users = await getAllUsers();
      const driverList = users.filter(u => u.role === "driver");
      setDrivers(driverList);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách tài xế!");
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await getAllBuses();
      const busList = res?.data || [];
      setBuses(busList);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách xe!");
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      const routeList = res?.data || [];
      setRoutes(routeList);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách tuyến!");
    }
  };

  const fetchSchedulesByDate = (date) => {
    if (!date) {
      setSchedules(originalSchedules);
      setCurrentPage(1);
      return;
    }
    const filtered = originalSchedules.filter((s) => s.date === date);
    setSchedules(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch trình này?")) return;

    try {
      const res = await deleteSchedule(id);

      if (res === null || res?.status === 204 || res?.success === true) {
        toast.success("Đã hủy lịch trình!");
        fetchSchedules();
        return;
      }
      toast.error("Hủy lịch trình thất bại!");
    } catch (err) {
      console.error(err);
      toast.error("Không thể hủy lịch trình!");
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingSchedule(null);
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await createSchedule(newSchedule);
      if (!res) {
        toast.error("Không thể thêm lịch trình!");
        return;
      }
      toast.success("Thêm lịch trình thành công!");
      setShowAddForm(false);
      setNewSchedule({
        driver_id: "",
        bus_id: "",
        route_id: "",
        date: "",
        start_time: "",
        end_time: "",
      });
      fetchSchedules();
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm lịch trình!");
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowAddForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateSchedule(editingSchedule.schedule_id, editingSchedule);
      if (!res) {
        toast.error("Không thể cập nhật lịch trình!");
        return;
      }
      toast.success("Cập nhật thành công!");
      setEditingSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật lịch trình!");
    }
  };

  const handleToggleDetail = (id) => {
    setShowingDetailId((prev) => (prev === id ? null : id));
  };

  // PHÂN TRANG
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = schedules.slice(startIdx, startIdx + itemsPerPage);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="manage-schedule">
      <ToastContainer position="top-center" autoClose={3000} />

      <h2>Quản lý lịch trình xe buýt</h2>

      {/* Nút thêm */}
      {!showAddForm && !editingSchedule && (
        <div className="schedule-toolbar">
          <button className="btn-add-schedule" onClick={handleAddClick}>
            <FiPlus size={18} /> Thêm lịch trình
          </button>

          <button
            className="btn-show-all"
            onClick={() => {
              setSelectedDate("");
              fetchSchedules();
            }}
          >
            <FiSend size={18} /> Hiện tất cả
          </button>

          <div className="date-filter">
            <label>Chọn ngày:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                fetchSchedulesByDate(e.target.value);
              }}
            />
          </div>
        </div>
      )}


      {/* FORM ADD */}
      {showAddForm && (
        <form className="schedule-form enhanced-form" onSubmit={handleAddSchedule}>
          <h3>Thêm lịch trình</h3>
          <label>Tài xế:</label>
          <select
            required
            value={newSchedule.driver_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, driver_id: e.target.value })}
          >
            <option value="">-- Chọn tài xế --</option>
            {drivers.length > 0 ? drivers.map(driver => (
              <option key={driver.userid} value={driver.userid}>
                {driver.username}
              </option>
            )) : <option value="">Chưa có tài xế</option>}
          </select>

          <label>Xe:</label>
          <select
            required
            value={newSchedule.bus_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, bus_id: e.target.value })}
          >
            <option value="">-- Chọn xe --</option>
            {buses.length > 0 ? buses.map(bus => (
              <option key={bus.bus_id} value={bus.bus_id}>
                {bus.model || bus.bus_id}
              </option>
            )) : <option value="">Chưa có xe</option>}
          </select>

          <label>Tuyến:</label>
          <select
            required
            value={newSchedule.route_id}
            onChange={(e) => setNewSchedule({ ...newSchedule, route_id: e.target.value })}
          >
            <option value="">-- Chọn tuyến --</option>
            {routes.length > 0 ? routes.map(route => (
              <option key={route.route_id} value={route.route_id}>
                {route.name}
              </option>
            )) : <option value="">Chưa có tuyến</option>}
          </select>

          <label>Ngày:</label>
          <input
            type="date"
            required
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
          />

          <div className="time-group">
            <div>
              <label>Bắt đầu:</label>
              <input
                type="time"
                required
                value={newSchedule.start_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
              />
            </div>
            <div>
              <label>Kết thúc:</label>
              <input
                type="time"
                required
                value={newSchedule.end_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="as-save-btn" type="submit">
              <FiSave size={18} style={{ marginRight: 6 }} />
              Lưu
            </button>

            <button className="as-cancel-btn" type="button" onClick={() => setShowAddForm(false)}>
              <MdCancel size={20} style={{ marginRight: 6 }} />
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* FORM EDIT */}
      {editingSchedule && (
        <form className="schedule-form enhanced-form" onSubmit={handleUpdate}>
          <h3>Chỉnh sửa lịch trình #{editingSchedule.schedule_id}</h3>
          <label>Tài xế:</label>
          <select
            required
            value={editingSchedule.driver_id}
            onChange={(e) => setEditingSchedule({ ...editingSchedule, driver_id: e.target.value })}
          >
            <option value="">-- Chọn tài xế --</option>
            {drivers.map(driver => (
              <option key={driver.userid} value={driver.userid}>
                {driver.username}
              </option>
            ))}
          </select>

          <label>Xe:</label>
          <select
            required
            value={editingSchedule.bus_id}
            onChange={(e) => setEditingSchedule({ ...editingSchedule, bus_id: e.target.value })}
          >
            <option value="">-- Chọn xe --</option>
            {buses.map(bus => (
              <option key={bus.bus_id} value={bus.bus_id}>
                {bus.model || bus.bus_id}
              </option>
            ))}
          </select>

          <label>Tuyến:</label>
          <select
            required
            value={editingSchedule.route_id}
            onChange={(e) => setEditingSchedule({ ...editingSchedule, route_id: e.target.value })}
          >
            <option value="">-- Chọn tuyến --</option>
            {routes.map(route => (
              <option key={route.route_id} value={route.route_id}>
                {route.name}
              </option>
            ))}
          </select>

          <label>Ngày:</label>
          <input
            type="date"
            required
            value={editingSchedule.date || ""}
            onChange={(e) => setEditingSchedule({ ...editingSchedule, date: e.target.value })}
          />

          <div className="time-group">
            <div>
              <label>Bắt đầu:</label>
              <input
                type="time"
                required
                value={editingSchedule.start_time}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, start_time: e.target.value })}
              />
            </div>
            <div>
              <label>Kết thúc:</label>
              <input
                type="time"
                required
                value={editingSchedule.end_time}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="as-save-btn" type="submit">
              <FiSave size={18} style={{ marginRight: 6 }} />
              Cập nhật
            </button>

            <button className="as-cancel-btn" type="button" onClick={() => setEditingSchedule(null)}>
              <MdCancel size={20} style={{ marginRight: 6 }} />
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      {!showAddForm && !editingSchedule && (
        <>
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
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <React.Fragment key={item.schedule_id}>
                    <tr>
                      <td>{item.schedule_id}</td>
                      <td>{item.bus_name}</td>
                      <td>{item.driver_name}</td>
                      <td>{item.route_name}</td>

                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(item)}>
                          <FiSave size={16} style={{ marginRight: 4 }} /> Sửa
                        </button>

                        <button className="delete-btn" onClick={() => handleDelete(item.schedule_id)}>
                          <FiTrash2 size={16} style={{ marginRight: 4 }} /> Hủy
                        </button>
                      </td>

                      <td>
                        <button className="detail-btn" onClick={() => handleToggleDetail(item.schedule_id)}>
                          <FiEye size={16} style={{ marginRight: 6 }} />
                          {showingDetailId === item.schedule_id ? "Ẩn" : "Chi tiết"}
                        </button>
                      </td>
                    </tr>

                    {showingDetailId === item.schedule_id && (
                      <tr className="detail-row">
                        <td colSpan="6">
                          <div className="detail-content">
                            <p><strong>Ngày:</strong> {item.date}</p>
                            <p><strong>Bắt đầu:</strong> {item.start_time}</p>
                            <p><strong>Kết thúc:</strong> {item.end_time}</p>
                            <p><strong>Trạng thái:</strong> Active</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có lịch trình!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PHÂN TRANG */}
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>-</button>
            <span>Trang {currentPage}/{totalPages || 1}</span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>+</button>
          </div>
        </>
      )}
    </div>
  );
}
