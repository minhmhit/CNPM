import { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const API_BASE = "http://localhost:5000/api/v1";

export default function SendMessage({ onBack }) {
  const [recipientType, setRecipientType] = useState("driver");
  const [message, setMessage] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [recipientUserId, setRecipientUserId] = useState("");
  const [userId, setUserId] = useState(""); // Khởi tạo state cho userId
  const [loading, setLoading] = useState(false);

  const [drivers, setDrivers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // 🟣 Lấy danh sách từ DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, studentsRes, schedulesRes] = await Promise.all([
          axios.get(`${API_BASE}/drivers`),
          axios.get(`${API_BASE}/students`),
          axios.get(`${API_BASE}/schedules`),
        ]);
        setDrivers(driversRes.data);
        setStudents(studentsRes.data);
        setSchedules(schedulesRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);
  
  // 🛠️ Lấy userId từ localStorage khi component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []); // Chạy 1 lần khi component mount

  const handleSend = async (e) => {
    e.preventDefault();

    // userId đã được tự động lấy, chỉ cần kiểm tra
    if (!message.trim() || !recipientUserId || !userId) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const mappedRecipientType =
        recipientType === "parents" ? "student" : recipientType;

      const res = await axios.post(`${API_BASE}/notification/create`, {
        userid: userId, // Dùng userId đã lấy từ localStorage
        recipient_type: mappedRecipientType,
        message: message,
        schedule_id: scheduleId || null,
        recipient_user_id: recipientUserId,
      });

      alert(res.data.message || "✅ Gửi thông báo thành công!");
      setMessage("");
      setRecipientUserId("");
      setScheduleId("");
      // Không reset userId vì nó đã được lấy tự động
      onBack();
    } catch (err) {
      console.error("Lỗi khi gửi tin:", err);
      alert(
        err.response?.data?.message ||
        "Không thể gửi tin nhắn. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="send-message-container">
      <h3>Gửi thông báo</h3>
      <form className="send-message-form" onSubmit={handleSend}>
        {/* --- KHỐI ID --- */}
        <div className="id-group">
          <div className="id-field">
            <label>Người gửi (User ID): </label>
            <input
              type="text"
              value={userId}
              disabled 
            />
          </div>

          <div className="id-field">
            <label>Người nhận: </label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
            >
              <option value="driver">Tài xế</option>
              <option value="parents">Phụ huynh</option>
            </select>
          </div>

          <div className="id-field">
            <label>ID người nhận: </label>
            <input
              type="number"
              value={recipientUserId}
              onChange={(e) => setRecipientUserId(e.target.value)}
              placeholder="Nhập ID người nhận (recipientUserId)"
            />
          </div>

          <div className="id-field">
            <label>ID lịch trình: </label>
            <input
              type="number"
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              placeholder="Nhập ID lịch trình (scheduleId)"
            />
          </div>
        </div>

        {/* --- NỘI DUNG --- */}
        <label>Nội dung: </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn cần gửi..."
          rows={5}
        />

        <div className="send-message-buttons">
          <button
            type="button"
            onClick={onBack}
            className="cancel-btn"
            disabled={loading}
          >
            Hủy
          </button>
          <button type="submit" className="send-btn" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
}