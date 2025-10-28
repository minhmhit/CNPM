import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Parents.css";

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Giả sử userid được lưu trong localStorage sau khi đăng nhập
  const userId = localStorage.getItem("userid") || 25; // test tạm user id 25

useEffect(() => {
  const fetchStudent = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/student/profile", {
        userid: userId,
      });

      console.log("✅ API response:", res.data);
      // ✅ Lấy đúng object data bên trong
      setStudent(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin sinh viên");
    } finally {
      setLoading(false);
    }
  };
  fetchStudent();
}, [userId]);

  // console.log(student);
  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Kiểm tra dữ liệu
  if (!student) return <p>Không tìm thấy dữ liệu sinh viên</p>;

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
          src={student.photo || "/src/pics/sgu.png"}
          alt="Student"
          className="student-photo"
        />


        <div className="student-info">
          <p><b>Họ và tên:</b> {student.name}</p>
          {student.className && <p><b>Lớp:</b> {student.className}</p>}
          {student.email && <p><b>Email:</b> {student.email}</p>}
          {student.pickup_name && <p><b>Điểm đón:</b> {student.pickup_name}</p>}
          {student.dropoff_name && <p><b>Điểm trả:</b> {student.dropoff_name}</p>}
        </div>

      </div>

      {/* Footer */}
      {/* <div className="student-footer">
        <p className="student-id">Student id: {student.student_id}</p>
        <div className="barcode"></div>
      </div> */}
    </div>
  );
}
