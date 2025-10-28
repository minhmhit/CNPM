import React, { useState } from "react";
import { FiHome, FiMap, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import Dashboard from "./Dashboard.jsx";
import Map from "./Map.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";
import "../Parents.css";

export default function Layout() {
  const [view, setView] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "map":
        return <Map />;
      case "notifications":
        return <Notifications onBack={() => setView("dashboard")} />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const handleMenuClick = (newView) => {
    setView(newView);
    setMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/src/pics/logo.png" alt="Logo" className="header-logo" />
          <div className="header-title-wrapper">
            <span className="header-title">Hệ Thống Đưa Đón Học Sinh</span>
          </div>
        </div>
        <div className="header-right">
          <span className="header-username">Xin chào, Phụ huynh</span>
          <img src="/src/pics/account-icon.png" alt="User" className="header-user-icon-img" />
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Main View Area */}
        <div className="view-area">
          {renderView()}
        </div>

        {/* Desktop Sidebar */}
        <aside className="dashboard-sidebar">
          <button
            className={`sidebar-btn ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            <FiHome className="sidebar-icon" />
            <span>Trang chủ</span>
          </button>
          <button
            className={`sidebar-btn ${view === "profile" ? "active" : ""}`}
            onClick={() => setView("profile")}
          >
            <FiUser className="sidebar-icon" />
            <span>Thông tin học sinh</span>
          </button>
          <button
            className={`sidebar-btn ${view === "map" ? "active" : ""}`}
            onClick={() => setView("map")}
          >
            <FiMap className="sidebar-icon" />
            <span>Theo dõi vị trí xe</span>
          </button>
          <button
            className={`sidebar-btn ${view === "notifications" ? "active" : ""}`}
            onClick={() => setView("notifications")}
          >
            <FiBell className="sidebar-icon" />
            <span>Thông báo</span>
          </button>

          <div className="sidebar-footer">
            <button
              className="sidebar-logout"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              <FiLogOut className="sidebar-icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="mobile-menu">
              <button
                className={`mobile-menu-btn ${view === "dashboard" ? "active" : ""}`}
                onClick={() => handleMenuClick("dashboard")}
              >
                <FiHome />
                <span>Trang chủ</span>
              </button>
              <button
                className={`mobile-menu-btn ${view === "profile" ? "active" : ""}`}
                onClick={() => handleMenuClick("profile")}
              >
                <FiUser />
                <span>Thông tin học sinh</span>
              </button>
              <button
                className={`mobile-menu-btn ${view === "map" ? "active" : ""}`}
                onClick={() => handleMenuClick("map")}
              >
                <FiMap />
                <span>Theo dõi vị trí xe</span>
              </button>
              <button
                className={`mobile-menu-btn ${view === "notifications" ? "active" : ""}`}
                onClick={() => handleMenuClick("notifications")}
              >
                <FiBell />
                <span>Thông báo</span>
              </button>
              <button
                className="mobile-menu-btn mobile-menu-logout"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                <FiLogOut />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
