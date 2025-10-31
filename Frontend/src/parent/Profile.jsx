import React, { useEffect, useState } from "react";
import api from "../util/axios.customize.js"; // ✅ SỬA ĐƯỜNG DẪN
import "../Parents.css";

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Lấy userid từ localStorage
        const userId = localStorage.getItem("userid") || "25";

        console.log("📡 Fetching student profile for userId:", userId);

        const res = await api.get("/student/profile/25");

        console.log("✅ Student data:", res.data);

        // Kiểm tra response structure
        if (res.data && res.data.data) {
          setStudent(res.data.data);
        } else if (res.data) {
          setStudent(res.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("❌ Error fetching student:", err);

        if (err.response) {
          setError(
            `Lỗi ${err.response.status}: ${
              err.response.data?.message || "Không thể tải thông tin"
            }`
          );
        } else if (err.request) {
          setError("Không thể kết nối đến server");
        } else {
          setError("Đã xảy ra lỗi: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div
        className="student-card"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <p>⏳ Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-card" style={{ padding: "40px" }}>
        <p style={{ color: "red", fontSize: "16px" }}>❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div
        className="student-card"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <p>⚠️ Không tìm thấy dữ liệu sinh viên</p>
      </div>
    );
  }

  return (
    <div className="student-card">
      {/* Header */}
      <div className="student-header">
        <img
          src="/src/pics/sgu.png"
          alt="SGU"
          className="student-logo"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/60x60?text=SGU";
          }}
        />
        <div>
          <h3>Trường Đại Học Sài Gòn</h3>
          <p>Sai Gon University</p>
        </div>
      </div>

      {/* Body */}
      <div className="student-body">
        <img
          src={student.photo || "/src/pics/account-icon.png"}
          alt="Student"
          className="student-photo"
          onError={(e) => {
            e.target.src = "/src/pics/account-icon.png";
          }}
        />

        <div className="student-info">
          <p>
            <strong>Họ và tên:</strong> {student.name || "N/A"}
          </p>
          {student.className && (
            <p>
              <strong>Lớp:</strong> {student.className}
            </p>
          )}
          {student.email && (
            <p>
              <strong>Email:</strong> {student.email}
            </p>
          )}
          {student.pickup_name && (
            <p>
              <strong>Điểm đón:</strong> {student.pickup_name}
            </p>
          )}
          {student.dropoff_name && (
            <p>
              <strong>Điểm trả:</strong> {student.dropoff_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
