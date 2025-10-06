import React from "react";
import bg from "../pics/backgroud.png";     // dùng đúng tên file hiện có
import "../Parents.css";

export default function Dashboard() {
  return (
    <div className="dashboard-home">
      <img src={bg} alt="background" className="dashboard-bg" />
      <div className="bus-card">
        <h1 className="bus-title">Bus Map</h1>
        <p className="bus-group">NHÓM 8 - CNPM</p>
      </div>
    </div>
  );
}
