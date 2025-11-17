import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { getAllDrivers, getAllUsers, getAllBuses, getAllRoutes } from "./api/ManageList.api";
import { getDriverSchedules, createSchedule } from "./api/ManageSchedule.api";
import "./Admin.css";
import { FiArrowLeft, FiEye, FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

export default function ManageDrivers({ onBack }) {
  const [drivers, setDrivers] = useState([]);
  const [driverSchedules, setDriverSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [detailItem, setDetailItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignData, setAssignData] = useState({
    bus_id: "",
    route_id: "",
    date: "",
    start_time: "",
    end_time: ""
  });

  // Load danh sách tài xế
  const loadDrivers = async () => {
    try {
      const [users, drivers] = await Promise.all([getAllUsers(), getAllDrivers()]);
      const activeDrivers = drivers
        .map(d => {
          const user = users.find(u => u.userid === d.userid);
          return { ...d, isActive: user?.isActive || 0 };
        })
        .filter(d => d.isActive === 1);
      setDrivers(activeDrivers);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách tài xế:", err);
      toast.error("Không thể tải danh sách tài xế!");
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // Xem chi tiết lịch trình tài xế
  const handleViewDetail = async (driver) => {
    const driverId = driver.driver_id;
    if (!driverId) return toast.error("ID tài xế không hợp lệ!");
    try {
      setLoadingSchedules(true);
      const res = await getDriverSchedules(driverId);
      setDriverSchedules(res.data || []);
      setDetailItem(driver);
      setShowDetail(true);
    } catch (err) {
      console.error("Lỗi tải lịch trình:", err);
      toast.error("Không thể tải lịch trình tài xế!");
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Mở popup phân công
  const handleAssign = async (driver) => {
    setDetailItem(driver);
    setShowAssign(true);
    try {
      const [busList, routeList] = await Promise.all([getAllBuses(), getAllRoutes()]);
      setBuses(busList.data || []);
      setRoutes(routeList.data || []);
    } catch (err) {
      console.error("Lỗi tải xe/tuyến:", err);
      toast.error("Không thể tải danh sách xe/tuyến!");
    }
  };

  // Submit phân công
  const handleAssignSubmit = async () => {
    if (!assignData.bus_id || !assignData.route_id || !assignData.date || !assignData.start_time || !assignData.end_time) {
      return toast.warn("Vui lòng điền đầy đủ thông tin!");
    }
    try {
      await createSchedule({
        driver_id: detailItem.driver_id,
        bus_id: assignData.bus_id,
        route_id: assignData.route_id,
        date: assignData.date,
        start_time: assignData.start_time,
        end_time: assignData.end_time
      });
      toast.success("Phân công thành công!");
      // Reload lịch trình ngay sau khi phân công
      const res = await getDriverSchedules(detailItem.driver_id);
      setDriverSchedules(res.data || []);
      setShowAssign(false);
    } catch (err) {
      console.error("Lỗi phân công:", err);
      toast.error("Phân công thất bại!");
    }
  };

  // Phân trang
  const totalPages = Math.ceil(drivers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = drivers.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="manage-list-container">
      <h3>Quản lý danh sách Tài xế</h3>

      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(d => (
            <tr key={d.driver_id}>
              <td>{d.driver_id}</td>
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.phone_number || "—"}</td>
              <td>
                <button className="detail-btn" onClick={() => handleViewDetail(d)}>
                  <FiEye size={17} style={{ marginRight: 4 }} /> Chi tiết
                </button>
                <button className="assign-btn" onClick={() => handleAssign(d)}>
                  <FiSend size={17} style={{ marginRight: 4 }} /> Phân công
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>-</button>
        <span>Trang {currentPage}/{totalPages || 1}</span>
        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>+</button>
      </div>

      {/* Popup chi tiết lịch trình */}
      {showDetail && detailItem && (
        <div className="overlay">
          <div className="popup-form">
            <h3>Thông tin chi tiết Tài xế</h3>
            <p><strong>ID:</strong> {detailItem.driver_id}</p>
            <p><strong>Tên:</strong> {detailItem.name}</p>
            <p><strong>SĐT:</strong> {detailItem.phone_number || "—"}</p>
            <p><strong>Email:</strong> {detailItem.email}</p>

            <h4>Lịch trình</h4>
            {loadingSchedules ? <p>Đang tải...</p> :
              driverSchedules.length === 0 ? <p>Chưa có lịch trình</p> :
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>ID lịch trình</th>
                    <th>Mã tuyến</th>
                    <th>Mã xe</th>
                    <th>Ngày</th>
                    <th>Giờ bắt đầu</th>
                    <th>Giờ kết thúc</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {driverSchedules.map(s => (
                    <tr key={s.schedule_id}>
                      <td>{s.schedule_id}</td>
                      <td>{s.route_id}</td>
                      <td>{s.bus_id}</td>
                      <td>{s.date}</td>
                      <td>{s.start_time}</td>
                      <td>{s.end_time}</td>
                      <td>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }

            <button className="cancel-form-btn" onClick={() => setShowDetail(false)} style={{ marginTop: 10 }}>
              <MdCancel size={17} style={{ marginRight: 4 }} />
              Đóng</button>
          </div>
        </div>
      )}

      {/* Popup phân công tài xế */}
      {showAssign && detailItem && (
        <div className="overlay">
          <div className="popup-form">
            <h3>Phân công Tài xế: {detailItem.name}</h3>

            <label>Mã xe:</label>
            <select value={assignData.bus_id} onChange={e => setAssignData({ ...assignData, bus_id: e.target.value })}>
              <option value="">Chọn xe</option>
              {buses.map(b => <option key={b.bus_id} value={b.bus_id}>{b.plate_number || b.bus_id}</option>)}
            </select>

            <label>Mã tuyến:</label>
            <select value={assignData.route_id} onChange={e => setAssignData({ ...assignData, route_id: e.target.value })}>
              <option value="">Chọn tuyến</option>
              {routes.map(r => <option key={r.route_id} value={r.route_id}>{r.name || r.route_id}</option>)}
            </select>

            <label>Ngày:</label>
            <input type="date" value={assignData.date} onChange={e => setAssignData({ ...assignData, date: e.target.value })} />

            <label>Giờ bắt đầu:</label>
            <input type="time" value={assignData.start_time} onChange={e => setAssignData({ ...assignData, start_time: e.target.value })} />

            <label>Giờ kết thúc:</label>
            <input type="time" value={assignData.end_time} onChange={e => setAssignData({ ...assignData, end_time: e.target.value })} />

            <button className="ad-save-form-btn" onClick={handleAssignSubmit} style={{ marginTop: 10 }}>
              <FiSend size={17} style={{ marginRight: 4 }} />
              Phân công</button>
            <button className="cancel-form-btn" onClick={() => setShowAssign(false)} style={{ marginTop: 10 }}>
              <MdCancel size={17} style={{ marginRight: 4 }} />
              Đóng</button>
          </div>
        </div>
      )}

      <button onClick={onBack} className="cancel-btn" style={{ marginTop: 15 }}>
        <FiArrowLeft size={18} style={{ marginRight: 6 }} /> Quay lại
      </button>
    </div>
  );
}
