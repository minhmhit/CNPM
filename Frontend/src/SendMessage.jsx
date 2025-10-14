import { useState } from "react";
import axios from "axios";
import "./Admin.css";

const API_BASE = "http://localhost:5000/api/v1"; // đổi nếu server khác

export default function SendMessage({ onBack }) {
  const [recipientType, setRecipientType] = useState("driver");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (message.trim() === "") {
      alert("Vui lòng nhập nội dung tin nhắn!");
      return;
    }

    try {
      setLoading(true);

      // 📡 Xác định endpoint tương ứng
      let url = "";
      switch (recipientType) {
        case "driver":
          url = `${API_BASE}/notification/driver`;
          break;
        case "parents":
          url = `${API_BASE}/notification/parent`;
          break;
        default:
          url = `${API_BASE}/notification/send`;
      }

      // 📨 Gửi request
      const res = await axios.post(url, {
        content: message,
      });

      alert(res.data.message || "✅ Đã gửi thông báo thành công!");
      setMessage("");
      onBack();
    } catch (err) {
      console.error("❌ Lỗi khi gửi tin:", err);
      alert(
        err.response?.data?.message || "Không thể gửi tin nhắn. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-message-container">
      <h3>📢 Gửi thông báo</h3>
      <form className="send-message-form" onSubmit={handleSend}>
        <label>Gửi đến:</label>
        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
        >
          <option value="driver">Tài xế</option>
          <option value="parents">Phụ huynh</option>
        </select>

        <label>Nội dung:</label>
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
          <button
            type="submit"
            className="send-btn"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
}
