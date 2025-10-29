import React, { useState } from "react";
import { FiMenu, FiCalendar, FiUserCheck, FiMap, FiSend, FiList, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "./pics/logo.png";
import accountIcon from "./pics/account-icon.png";
import SendMessage from "./SendMessage";
import ManageList from "./ManageList";
import ManageSchedule from "./ManageSchedule.jsx";
import AssignDriver from "./AssignDriver.jsx";
import TrackingMap from "./TrackingMap.jsx";
import "./Admin.css";

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
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      navigate("/");
      localStorage.clear();
    }
  };

  const renderView = () => {
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
          <div className="dashboard-home">
            <div className="bus-card">
              <h1 className="bus-title">Trang Quản Lý</h1>
              <div className="bus-group">Chọn chức năng để thao tác</div>
            </div>
          </div>
        );
    }
  };

  const NAVS = [
    { key: "schedule", label: "Quản lý lịch trình", icon: <FiCalendar /> },
    { key: "assignDriver", label: "Phân công tài xế", icon: <FiUserCheck /> },
    { key: "tracking", label: "Theo dõi vị trí xe", icon: <FiMap /> },
    { key: "sendMessage", label: "Gửi tin nhắn", icon: <FiSend /> },
    { key: "manageList", label: "Quản lý danh sách", icon: <FiList /> },
  ];

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="logo" className="header-logo" />
          <span className="header-title">Bus Map - Admin</span>
        </div>

        <div className="header-right">
          <img src={accountIcon} alt="account" className="header-user-icon-img" />
          <span>Xin chào, Quản lý</span>
          {/* Nút menu 3 gạch */}
          <button
            className="header-menu-btn"
            title="Mở menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* NỘI DUNG */}
      <div className="dashboard-content">
        <main className="view-area">{renderView()}</main>

        {/* SIDEBAR POPUP */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          {NAVS.map((nav) => (
            <button
              key={nav.key}
              className={`sidebar-btn ${activePanel === nav.key ? "active" : ""}`}
              onClick={() => {
                setActivePanel(nav.key);
                setIsSidebarOpen(false); // đóng sau khi chọn
              }}
            >
              <span style={{ fontSize: 18 }}>{nav.icon}</span> {nav.label}
            </button>
          ))}

          <div className="sidebar-footer">
            <button
              className="sidebar-logout"
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
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
