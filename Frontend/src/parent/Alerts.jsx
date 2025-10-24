import React, { useState } from "react";
import "../Parents.css";

export default function Alerts({ onBack }) {
  const [alerts] = useState([
    {
      id: 1,
      title: "🚨 KHẨN CẤP: Tai nạn giao thông",
      message: "Xe tuyến B01 gặp va chạm nhẹ tại ngã tư Bình Phước lúc 7:15. Tất cả học sinh an toàn.",
      time: "10 phút trước",
      type: "danger"
    },
    {
      id: 2,
      title: "⚠️ Trễ giờ đón",
      message: "Do mưa lớn và tắc đường, xe sẽ đến muộn 20 phút. Dự kiến 7:25 sáng.",
      time: "30 phút trước",
      type: "warning"
    },
    {
      id: 3,
      title: "🔄 Thay đổi tuyến đường",
      message: "Tuyến B01 tạm thời đổi sang đường Lê Văn Quới do thi công.",
      time: "2 giờ trước",
      type: "info"
    },
  ]);

  return (
    <div className="alert-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>⚠️ Cảnh báo</h2>
      </div>

      <div className="content-box">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-item alert-${alert.type}`}>
            <div className="item-header">
              <strong>{alert.title}</strong>
              <span className="item-time">{alert.time}</span>
            </div>
            <div className="alert-message-box">
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

