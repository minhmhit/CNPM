import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import "../Parents.css";

export default function Alerts({ onNavigate }) {
  return (
    <div className="alert-page">
      <div className="alert-header">
        <button className="back-btn" onClick={() => onNavigate && onNavigate("map")}>
          <FiArrowLeft />
        </button>
        <h2>CẢNH BÁO</h2>
      </div>

      <div className="alert-box">
        <p>Không có cảnh báo!</p>
      </div>
    </div>
  );
}

