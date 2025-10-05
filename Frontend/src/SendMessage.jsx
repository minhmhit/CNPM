import { useState } from "react";
import "./Admin.css";

export default function SendMessage({ onBack }) {
  const [recipientType, setRecipientType] = useState("driver");
  const [message, setMessage] = useState("");
  const handleSend = (e) => {
    e.preventDefault();

    if (message.trim() === "") {
      alert("Vui lòng nhập nội dung tin nhắn!");
      return;
    }

    alert(`Đã gửi tin nhắn tới ${recipientType === "driver" ? "Tài xế" : "Phụ huynh"}:\n"${message}"`);
    setMessage("");
    onBack(); // Quay lại trang Admin chính
  };

  return (
    <div className="send-message-container">
      <h3>Gửi thông báo</h3>
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
        />

        <div className="send-message-buttons">
          <button type="button" onClick={onBack} className="cancel-btn">Hủy</button>
          <button type="submit" className="send-btn">Gửi</button>
        </div>
      </form>
    </div>
  );
}
