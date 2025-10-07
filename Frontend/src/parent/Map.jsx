import React from "react";
import "../Parents.css";

export default function Map() {
  return (
    <div className="map-view">
      {/* Placeholder map (sau này nhúng Google Maps/Leaflet vào đây) */}
      <div className="map-placeholder">
        <p>Map sẽ hiển thị ở đây</p>
      </div>

      {/* Bảng thông tin */}
      <div className="map-info-card">
        <div className="map-info-text">
          <p><b>Tên học sinh:</b> jiki</p>
          <p><b>Vị trí hiện tại:</b> thanh hoa</p>
          <p><b>Mã số xe Bus:</b> 36A-36363</p>
          <p><b>Tên tài xế:</b> bé xuân mai</p>
        </div>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy-A3XorLZjaeY0RfKbYFs9rlL_7U16JorIA&s"
          alt="driver"
          className="map-driver-img"
        />
      </div>
    </div>
  );
}
