import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageSchedule.css";
import {
  getAllSchedules,
  deleteSchedule,
  createSchedule,
  updateSchedule,
  addStudentToSchedule
} from "./api/ManageSchedule.api";
import { getAllBuses, getAllRoutes, getAllDrivers, getAllStudents } from "./api/ManageList.api";
import { FiSave, FiPlus, FiTrash2, FiSend, FiEye } from "react-icons/fi";
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
  const [selectedDriver, setSelectedDriver] = useState("");
  const [students, setStudents] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    driver_id: "",
    bus_id: "",
    route_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const studentsPerPage = 3;

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
      const formatted = (res?.data || []).map((item) => ({
        ...item,
        date: item.date ? item.date.slice(0, 10) : "",
      }));
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
      const res = await getAllDrivers();
      setDrivers(res || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách tài xế!");
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await getAllBuses();
      setBuses(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách xe!");
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await getAllRoutes();
      setRoutes(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách tuyến!");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data || []);
      return data || [];
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách học sinh!");
      return [];
    }
  };

  const handleAddClick = async () => {
    try {
      const studentList = await getAllStudents();
      setStudents(studentList || []);
      setNewSchedule({
        driver_id: "",
        bus_id: "",
        route_id: "",
        date: "",
        start_time: "",
        end_time: "",
        student_ids: [],
      });
      setCurrentStudentPage(1);
      setShowAddForm(true);
      setEditingSchedule(null);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách học sinh!");
    }
  };



  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDriver) {
      toast.error("Vui lòng chọn tài xế!");
      return;
    }

    try {
      const scheduleToAdd = {
        ...newSchedule,
        driver_id: Number(selectedDriver),
      };

      const res = await createSchedule(scheduleToAdd);

      if (!res || !res.schedule_id) {
        toast.error("Không thể thêm lịch trình!");
        return;
      }

      // Nếu muốn thêm học sinh ngay sau khi schedule được tạo
      if (newSchedule.student_ids && newSchedule.student_ids.length > 0) {
        for (const studentId of newSchedule.student_ids) {
          const addRes = await addStudentToSchedule(res.schedule_id, studentId);
          if (!addRes) {
            toast.warning(`Thêm học sinh ${studentId} thất bại`);
          }
        }
      }

      toast.success("Thêm lịch trình và học sinh thành công!");
      setShowAddForm(false);
      setSelectedDriver("");
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

  const handleAddStudent = (studentId) => {
    setNewSchedule((prev) => ({
      ...prev,
      student_ids: prev.student_ids.includes(studentId)
        ? prev.student_ids
        : [...prev.student_ids, studentId],
    }));
    toast.success("Đã chọn học sinh!");
  };


  const handleToggleDetail = (id) => {
    setShowingDetailId((prev) => (prev === id ? null : id));
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

  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = schedules.slice(startIdx, startIdx + itemsPerPage);

  const totalStudentPages = Math.ceil(students.length / studentsPerPage);
  const studentStartIdx = (currentStudentPage - 1) * studentsPerPage;
  const paginatedStudents = students.slice(studentStartIdx, studentStartIdx + studentsPerPage);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="manage-schedule">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Quản lý lịch trình xe buýt</h2>

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

      {showAddForm && (
        <form className="schedule-form enhanced-form" onSubmit={handleAddSchedule}>
          <h3>Thêm lịch trình</h3>

          <div className="form-layout">
            {/* --- Phần trái: Thông tin tài xế/xe/tuyến/Ngày/Thời gian --- */}
            <div className="form-left">
              <label>Tài xế:</label>
              <select required value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
                <option value="">-- Chọn tài xế --</option>
                {drivers.map((driver) => (
                  <option key={driver.driver_id} value={driver.driver_id}>{driver.name}</option>
                ))}
              </select>

              <label>Xe:</label>
              <select required value={newSchedule.bus_id} onChange={(e) => setNewSchedule({ ...newSchedule, bus_id: e.target.value })}>
                <option value="">-- Chọn xe --</option>
                {buses.length > 0 ? buses.map(bus => (
                  <option key={bus.bus_id} value={bus.bus_id}>{bus.model || bus.bus_id}</option>
                )) : <option value="">Chưa có xe</option>}
              </select>

              <label>Tuyến:</label>
              <select required value={newSchedule.route_id} onChange={(e) => setNewSchedule({ ...newSchedule, route_id: e.target.value })}>
                <option value="">-- Chọn tuyến --</option>
                {routes.length > 0 ? routes.map(route => (
                  <option key={route.route_id} value={route.route_id}>{route.name}</option>
                )) : <option value="">Chưa có tuyến</option>}
              </select>

              <label>Ngày:</label>
              <input type="date" required value={newSchedule.date} onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })} />

              <div className="time-group">
                <div>
                  <label>Bắt đầu:</label>
                  <input type="time" required value={newSchedule.start_time} onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })} />
                </div>
                <div>
                  <label>Kết thúc:</label>
                  <input type="time" required value={newSchedule.end_time} onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })} />
                </div>
              </div>
            </div>

            {/* --- Phần phải: Danh sách học sinh --- */}
            <div className="form-right">
              <div className="student-list">
                <h4>Thêm học sinh vào lịch trình</h4>
                {students.length > 0 ? (
                  <>
                    <div className="student-list-container">
                      <ul>
                        {paginatedStudents.map((student) => (
                          <li key={student.student_id} className="student-item">
                            <div className="student-info">
                              <span className="student-name">{student.name}</span>
                              {newSchedule.student_ids?.includes(student.student_id) && (
                                <span className="student-selected">Đã chọn</span>
                              )}
                            </div>
                            <button
                              type="button"
                              className={`add-student-btn ${newSchedule.student_ids?.includes(student.student_id) ? 'selected' : ''}`}
                              onClick={() => handleAddStudent(student.student_id)}
                            >
                              {newSchedule.student_ids?.includes(student.student_id) ? 'Đã chọn' : 'Thêm'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {totalStudentPages > 1 && (
                      <div className="student-pagination">
                        <button 
                          type="button"
                          disabled={currentStudentPage === 1}
                          onClick={() => setCurrentStudentPage(p => p - 1)}
                          className="pagination-btn"
                        >
                          ←
                        </button>
                        <span className="pagination-info">
                          Trang {currentStudentPage}/{totalStudentPages} ({students.length} học sinh)
                        </span>
                        <button 
                          type="button"
                          disabled={currentStudentPage === totalStudentPages}
                          onClick={() => setCurrentStudentPage(p => p + 1)}
                          className="pagination-btn"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="no-students">Chưa có học sinh!</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="as-save-btn" type="submit"><FiSave size={18} style={{ marginRight: 6 }} />Lưu lịch trình</button>
            <button className="as-cancel-btn" type="button" onClick={() => setShowAddForm(false)}><MdCancel size={20} style={{ marginRight: 6 }} />Hủy</button>
          </div>
        </form>
      )}

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
              {currentItems.length > 0 ? currentItems.map((item) => (
                <React.Fragment key={item.schedule_id}>
                  <tr>
                    <td>{item.schedule_id}</td>
                    <td>{item.bus_name}</td>
                    <td>{item.driver_name}</td>
                    <td>{item.route_name}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}><FiSave size={16} style={{ marginRight: 4 }} />Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.schedule_id)}><FiTrash2 size={16} style={{ marginRight: 4 }} />Hủy</button>
                    </td>
                    <td>
                      <button className="detail-btn" onClick={() => handleToggleDetail(item.schedule_id)}><FiEye size={16} style={{ marginRight: 6 }} />{showingDetailId === item.schedule_id ? "Ẩn" : "Chi tiết"}</button>
                    </td>
                  </tr>
                  {showingDetailId === item.schedule_id && (
                    <tr className="detail-row">
                      <td colSpan="6">
                        <div className="detail-content">
                          <p><strong>Ngày:</strong> {item.date}</p>
                          <p><strong>Bắt đầu:</strong> {item.start_time}</p>
                          <p><strong>Kết thúc:</strong> {item.end_time}</p>
                          <p><strong>Trạng thái:</strong> {item.status}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: "center" }}>Không có lịch trình!</td></tr>
              )}
            </tbody>
          </table>

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
