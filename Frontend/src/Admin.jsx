import React, { useState } from "react";
import { FiMenu, FiCalendar, FiUserCheck, FiMap, FiSend, FiList, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của toastify

import logo from "./pics/logo.png";
import accountIcon from "./pics/account-icon.png";
import SendMessage from "./SendMessage";
import ManageList from "./ManageList";
import ManageSchedule from "./ManageSchedule.jsx";
import AssignDriver from "./AssignDriver.jsx";
import TrackingMap from "./TrackingMap.jsx";
import "./Admin.css"; // Đảm bảo bạn đang dùng file Admin.css đã đổi class

export default function Admin() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [schedules, setSchedules] = useState([
    { id: "LX01", route: "Bến xe A - Bến xe B", date: "2025-10-13", driver: null },
    { id: "LX02", route: "Bến xe C - Bến xe D", date: "2025-10-14", driver: null },
  ]);

  const [drivers, setDrivers] = useState([
    { id: "TX01", name: "Nguyễn Văn A", phone: "0901234567", status: "Rảnh" },
    { id: "TX02", name: "Trần Văn B", phone: "0902345678", status: "Bận" },
    { id: "TX03", name: "Lê Văn C", phone: "0903456789", status: "Rảnh" },
  ]);

  const handleAssign = (schedule, driver) => {
    const updatedSchedules = schedules.map((s) =>
      s.id === schedule.id ? { ...s, driver: driver.name } : s
    );
    setSchedules(updatedSchedules);

    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id ? { ...d, status: "Bận" } : d
    );
    setDrivers(updatedDrivers);

    // Thêm toast thông báo thành công
    toast.success(`Đã phân công tài xế ${driver.name} cho lịch trình ${schedule.id}!`, {
      position: "top-right",
    });
  };

  const handleLogout = () => {
  // Giữ lại window.confirm để đảm bảo hành động được xác nhận
  if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {

    localStorage.clear();
    toast.info("Đăng xuất thành công.", { 
      position: "top-center",
      autoClose: 2000, // Toast tự đóng sau 2 giây
      pauseOnFocusLoss: false 
    });
    setTimeout(() => {
      navigate("/");
    }, 1000); 
  } 
};

  const renderView = () => {
    // ... (Giữ nguyên logic renderView)
    switch (activePanel) {
      case "schedule":
        return <ManageSchedule />;
      case "assignDriver":
        return (
          <AssignDriver
            schedules={schedules}
            drivers={drivers}
            onAssign={handleAssign}
            onBack={() => setActivePanel("dashboard")}
          />
        );
      case "sendMessage":
        return <SendMessage onBack={() => setActivePanel("dashboard")} />;
      case "tracking":
        return <TrackingMap />;

      case "manageList":
        return <ManageList onBack={() => setActivePanel("dashboard")} />;
      default:
        return (
          <div className="admin-dashboard-home">
            <div className="admin-bus-card">
              <h1 className="admin-bus-title">Trang Quản Lý</h1>
              <div className="admin-bus-group">Chọn chức năng để thao tác</div>
            </div>
          </div>
        );
    }
  };

  const NAVS = [
    // ... (Giữ nguyên NAVS)
    { key: "schedule", label: "Quản lý lịch trình", icon: <FiCalendar /> },
    { key: "assignDriver", label: "Phân công tài xế", icon: <FiUserCheck /> },
    { key: "tracking", label: "Theo dõi vị trí xe", icon: <FiMap /> },
    { key: "sendMessage", label: "Gửi tin nhắn", icon: <FiSend /> },
    { key: "manageList", label: "Quản lý danh sách", icon: <FiList /> },
  ];

  return (
    <div className="admin-dashboard-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Tùy chọn theme màu sắc
      />

      {/* HEADER */}
      <header className="admin-dashboard-header">
        {/* ... */}
        <div className="admin-header-left">
          <img src={logo} alt="logo" className="admin-header-logo" />
          <span className="admin-header-title">Bus Map - Admin</span>
        </div>

        <div className="admin-header-right">
          <img src={accountIcon} alt="account" className="admin-header-user-icon-img" />
          <span>Xin chào, Quản lý</span>
          {/* Nút menu 3 gạch */}
          <button
            className="admin-header-menu-btn"
            title="Mở menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* NỘI DUNG */}
      <div className="admin-dashboard-content">
        <main className="admin-view-area">{renderView()}</main>

        {/* SIDEBAR POPUP */}
        <aside className={`admin-dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          {NAVS.map((nav) => (
            <button
              key={nav.key}
              className={`admin-sidebar-btn ${activePanel === nav.key ? "active" : ""}`}
              onClick={() => {
                setActivePanel(nav.key);
                setIsSidebarOpen(false); // đóng sau khi chọn
              }}
            >
              <span style={{ fontSize: 18 }}>{nav.icon}</span> {nav.label}
            </button>
          ))}

          <div className="admin-sidebar-footer">
            <button
              className="admin-sidebar-logout"
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
            >
              <FiLogOut /> Đăng xuất
            </button>
          </div>
        </aside>

        {/* Overlay (click để đóng menu) */}
        {isSidebarOpen && (
          <div
            className="admin-sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}