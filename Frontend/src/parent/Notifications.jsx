import React, { useState } from "react";
import "../Parents.css";

export default function Notifications({ onBack }) {
  const [notifications] = useState([
    {
      id: 1,
      title: "Thông báo lịch nghỉ Tết",
      message: "Xe nghỉ từ ngày 28/1 đến 5/2. Học sinh sẽ được đưa đón lại từ ngày 6/2.",
      time: "2 giờ trước",
    },
    {
      id: 2,
      title: "Xe đã đón con bạn",
      message: "Học sinh Nguyễn Gia Khánh đã lên xe lúc 6:45 sáng tại điểm đón Ngã tư Bình Phước.",
      time: "45 phút trước",
    },
    {
      id: 3,
      title: "Thay đổi giờ đón",
      message: "Do tắc đường, xe sẽ đến điểm đón muộn 10 phút. Dự kiến 7:10 sáng.",
      time: "1 giờ trước",
    },
    {
      id: 4,
      title: "Xe đã trả con bạn",
      message: "Học sinh đã được trả an toàn tại điểm trả Công viên Lâm Văn Bền lúc 17:30.",
      time: "3 giờ trước",
    },
  ]);

  return (
    <div className="notification-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🔔 Thông báo</h2>
      </div>

      <div className="content-box">
        {notifications.map(notif => (
          <div key={notif.id} className="content-item">
            <div className="item-header">
              <strong>{notif.title}</strong>
              <span className="item-time">{notif.time}</span>
            </div>
            <p className="item-message">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


