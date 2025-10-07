import React, { useState } from "react";
import { FiHome, FiMap, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import Dashboard from "./Dashboard.jsx";
import Map from "./Map.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";
import logo from "../pics/logo.png";
import accountIcon from "../pics/account-icon.png";
import "../Parents.css";

const NAVS = [
  { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
  { key: "map", label: "Theo dõi vị trí xe", icon: <FiMap /> },
  { key: "notifications", label: "Nhận thông báo", icon: <FiBell /> },
  { key: "profile", label: "Thông tin học sinh", icon: <FiUser /> },
];

export default function ParentLayout() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
  switch (view) {
    case "dashboard": return <Dashboard />;
    case "map": return <Map />;
    case "notifications": return <Notifications onNavigate={setView} />; // ✅ thêm onNavigate
    case "profile": return <Profile />;
    default: return <Dashboard />;
  }
};

  return (
    <div className="dashboard-container">
      {/* Header tím */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="logo" className="header-logo" />
          <span className="header-title">Bus Map</span>
        </div>

        <div className="header-right">
          <img src={accountIcon} alt="account" className="header-user-icon-img" />
          <span>Xin chào, name!</span>
          {/* 🔔 Chuông xanh: chuyển qua Thông báo */}
          <button
            className="header-bell-btn"
            title="Xem thông báo"
            onClick={() => setView("notifications")}
          >
            <FiBell />
          </button>
        </div>
      </header>

      {/* Nội dung + sidebar phải */}
      <div className="dashboard-content">
        {/* Khu nội dung trung tâm của từng trang */}
        <main className="view-area">
          {renderView()}
        </main>

        {/* Sidebar phải */}
        <aside className="dashboard-sidebar">
          {NAVS.map(n => (
            <button
              key={n.key}
              className={`sidebar-btn ${view === n.key ? "active" : ""}`}
              onClick={() => setView(n.key)}
            >
              <span style={{fontSize:18}}>{n.icon}</span> {n.label}
            </button>
          ))}

          <div className="sidebar-footer">
            <button
              className="sidebar-logout"
              onClick={() => (window.location.href = "/login")}
            >
              <FiLogOut /> Đăng xuất
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
