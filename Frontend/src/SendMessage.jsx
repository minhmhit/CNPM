import { useState, useEffect } from "react";
import "./Admin.css";
import { toast } from "react-toastify";
import { getAllUsers } from "./api/ManageList.api";
import { getAllSchedules } from "./api/ManageSchedule.api";
import { sendMessage } from "./api/SendMessage.api";
import { FiSave, FiPlus, FiTrash2, FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

export default function SendMessage({ onBack }) {
  const [recipientType, setRecipientType] = useState("driver");
  const [message, setMessage] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [recipientUserId, setRecipientUserId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [drivers, setDrivers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const schedulesRes = await getAllSchedules();

        setDrivers(users.filter((u) => u.role === "driver"));
        setStudents(users.filter((u) => u.role === "student"));
        setSchedules(schedulesRes);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || !recipientUserId || !userId) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);

      const mappedRecipientType =
        recipientType === "parents" ? "student" : recipientType;

      const payload = {
        userid: Number(userId),
        recipient_type: mappedRecipientType,
        message,
        schedule_id: scheduleId || null,
        recipient_user_id: Number(recipientUserId),
      };

      const res = await sendMessage(payload);

      if (!res) {
        toast.error("Không gửi được tin nhắn!");
        return;
      }

      toast.success(res.message || "Gửi thông báo thành công!");

      setMessage("");
      setRecipientUserId("");
      setScheduleId("");
    } catch (err) {
      console.error("Lỗi khi gửi tin:", err);
      toast.error(
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
        {/* KHỐI ID */}
        <div className="id-group">
          <div className="id-field">
            <label>Người gửi (User ID):</label>
            <input type="text" value={userId} disabled />
          </div>

          <div className="id-field">
            <label>Người nhận:</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
            >
              <option value="driver">Tài xế</option>
              <option value="parents">Phụ huynh</option>
            </select>
          </div>

          <div className="id-field">
            <label>ID người nhận:</label>
            <input
              type="number"
              value={recipientUserId}
              onChange={(e) => setRecipientUserId(e.target.value)}
              placeholder="Nhập ID người nhận"
            />
          </div>

          <div className="id-field">
            <label>ID lịch trình:</label>
            <input
              type="number"
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              placeholder="Nhập ID lịch trình"
            />
          </div>
        </div>

        {/* NỘI DUNG */}
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
            className="sm-cancel-btn"
            disabled={loading}
          >
            <MdCancel size={18} style={{ marginRight: 6 }} />
            Hủy
          </button>

          <button type="submit" className="send-btn" disabled={loading}>
            {loading ? (
              "Đang gửi..."
            ) : (
              <>
                <FiSend size={18} style={{ marginRight: 6 }} />
                Gửi
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
