import React, { useState } from "react";
import { FiHome, FiMap, FiBell, FiUser, FiLogOut, FiAlertCircle, FiMenu, FiX } from "react-icons/fi";
import Dashboard from "./Dashboard.jsx";
import Map from "./Map.jsx";
import Notifications from "./Notifications.jsx";
import Alerts from "./Alerts.jsx";
import Profile from "./Profile.jsx";
import logo from "../pics/logo.png";
import accountIcon from "../pics/account-icon.png";
import "../Parents.css";

const NAVS = [
  { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
  { key: "map", label: "Theo d\u1ed5i v\u1ecb tr\u00ed xe", icon: <FiMap /> },
  { key: "notifications", label: "Nh\u1eadn th\u00f4ng b\u00e1o", icon: <FiBell /> },
  { key: "profile", label: "Th\u00f4ng tin h\u1ecdc sinh", icon: <FiUser /> },
];

// Extend sidebar nav with Alerts for PC
const NAVS_FULL = [
  { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
  { key: "map", label: "Theo d\u1ed5i v\u1ecb tr\u00ed xe", icon: <FiMap /> },
  { key: "notifications", label: "Nh\u1eadn th\u00f4ng b\u00e1o", icon: <FiBell /> },
  { key: "alerts", label: "C\u1ea3nh b\u00e1o", icon: <FiAlertCircle /> },
  { key: "profile", label: "Th\u00f4ng tin h\u1ecdc sinh", icon: <FiUser /> },
];

export default function ParentLayout() {
  const [view, setView] = useState("dashboard");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
  switch (view) {
    case "dashboard": return <Dashboard />;
    case "map": return <Map />;
    case "notifications": return <Notifications onNavigate={setView} />; // 
    case "alerts": return <Alerts onNavigate={setView} />;
    case "profile": return <Profile />;
    default: return <Dashboard />;
  }
};

  return (
    <div className="dashboard-container">
      {/* Header tÃ­m */}
      <header className="dashboard-header">
        <div className="header-left" onClick={() => setView("dashboard")} style={{cursor:'pointer'}}>
          <img src={logo} alt="logo" className="header-logo" />
          <span className="header-title">Bus Map</span>
        </div>

        <div className="header-right">
          <img src={accountIcon} alt="account" className="header-user-icon-img" />
          <span>Xin chào, name!</span>
          {/* ðŸ”” ChuÃ´ng xanh: chuyá»ƒn qua ThÃ´ng bÃ¡o */}
          <button
            className="header-bell-btn"
            title="Xem thông báo"
            onClick={() => setView("notifications")}
          >
            <FiBell />
          </button>

          {/* Nút Hamburger Menu cho di động */}
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

     
      {/* Menu cho di động, chỉ hiển thị khi isMobileMenuOpen là true */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {NAVS_FULL.map(n => (
            <button
              key={n.key}
              className={`mobile-menu-btn ${view === n.key ? "active" : ""}`}
              onClick={() => {
                setView(n.key);
                setMobileMenuOpen(false); // Đóng menu sau khi chọn
              }}
            >
              <span style={{ fontSize: 18 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </div>
      )}

    
      <div className="dashboard-content">
       
        <main className="view-area">
          {renderView()}
        </main>

       
        <aside className="dashboard-sidebar">
          {NAVS_FULL.map(n => (
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
