import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import "../Parents.css";

export default function Notifications({ onNavigate }) {
  return (
    <div className="notification-page">
      <div className="notification-header">
        <button className="back-btn" onClick={() => onNavigate && onNavigate("map")}>
          <FiArrowLeft />
        </button>
        <h2>THÔNG BÁO</h2>
      </div>

      <div className="notification-box">
        <p>Không có thông báo !</p>
      </div>
    </div>
  );
}
