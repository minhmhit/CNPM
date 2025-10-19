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
        <h2>{"TH\u00d4NG B\u00c1O"}</h2>
      </div>

      <div className="notification-box">
        <p>{"Kh\u00f4ng c\u00f3 th\u00f4ng b\u00e1o !"}</p>
      </div>
    </div>
  );
}


