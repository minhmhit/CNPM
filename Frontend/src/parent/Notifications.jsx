import React, { useState, useEffect } from "react";
import "../Parents.css";
import api from "../util/axios.customize.js";

export default function Notifications({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoti();
  }, []);

  async function fetchNoti() {
    try {
      setLoading(true);
      const userid = localStorage.getItem("userId") || "12";
      const res = await api.get(`/notification/my/${userid}`);
      
      console.log("✅ Full Response:", res.data);
      
      // ✅ SỬA: LẤY ĐÚNG PATH res.data.data.notifications
      let notiData = [];
      
      if (res.data?.data?.notifications && Array.isArray(res.data.data.notifications)) {
        notiData = res.data.data.notifications;
      } else if (res.data?.notifications && Array.isArray(res.data.notifications)) {
        notiData = res.data.notifications;
      } else if (Array.isArray(res.data?.data)) {
        notiData = res.data.data;
      } else if (Array.isArray(res.data)) {
        notiData = res.data;
      }
      
      console.log("📦 Final notifications array:", notiData);
      setNotifications(notiData);
      
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="notification-page">
        <div className="page-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <h2>🔔 Thông báo</h2>
        </div>
        <div className="content-box">
          <div className="content-item" style={{ textAlign: "center", padding: "40px" }}>
            <p>⏳ Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>🔔 Thông báo ({notifications.length})</h2>
      </div>

      <div className="content-box">
        {notifications.length === 0 ? (
          <div className="content-item" style={{ textAlign: "center", padding: "40px" }}>
            <p>📭 Chưa có thông báo</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div key={notif.notification_id || index} className="content-item">
              <p className="item-message">
                {notif.message || "Không có nội dung"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


