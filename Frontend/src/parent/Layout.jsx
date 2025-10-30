import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMap,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import Dashboard from "./Dashboard.jsx";
import Map from "./Map.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";
import logo from "../pics/logo.png";
import accountIcon from "../pics/account-icon.png";
import "../Parents.css";

export default function ParentLayout() {
  const [view, setView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const NAVS = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "map", label: "Theo dõi vị trí xe", icon: <FiMap /> },
    { key: "notifications", label: "Nhận thông báo", icon: <FiBell /> },
    { key: "profile", label: "Thông tin học sinh", icon: <FiUser /> },
  ];

  // Chuyển giữa các view
  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "map":
        return <Map onBack={() => setView("dashboard")} />;
      case "notifications":
        return <Notifications onBack={() => setView("dashboard")} />;
      case "profile":
        return <Profile />;
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="logo" className="header-logo" />
          <span className="header-title">Bus Map</span>
        </div>

        <div className="header-right">
          <img
            src={accountIcon}
            alt="account"
            className="header-user-icon-img"
          />
          <span>Xin chào, name!</span>

          {/* Chuông thông báo */}
          <button
            className="header-bell-btn"
            title="Xem thông báo"
            onClick={() => setView("notifications")}
          >
            <FiBell />
          </button>

          {/* Menu icon */}
          <button
            className="header-menu-btn"
            title="Mở menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Nội dung chính */}
      <div className="dashboard-content">
        <main className="view-area">{renderView()}</main>

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          {NAVS.map((nav) => (
            <button
              key={nav.key}
className={`sidebar-btn ${view === nav.key ? "active" : ""}`}
              onClick={() => {
                setView(nav.key);
                setIsSidebarOpen(false); // đóng sidebar sau khi chọn
              }}
            >
              <span style={{ fontSize: 18 }}>{nav.icon}</span>
              {nav.label}
            </button>
          ))}

          <div className="sidebar-footer">
            <button
              className="sidebar-logout"
              onClick={() => navigate("/login")}
            >
              <FiLogOut /> Đăng xuất
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}