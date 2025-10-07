import React from "react";
import "../Parents.css";
import logo from "../pics/logo.png";
import studentImg from "../pics/account-icon.png"; // tạm thời dùng ảnh có sẵn

export default function Profile() {
  return (
    <div className="student-card">
      {/* Header thẻ */}
      <div className="student-header">
        <img src={logo} alt="SGU logo" className="student-logo" />
        <div>
          <h3>Trường Đại Học Sài Gòn</h3>
          <p>Sai Gon University</p>
        </div>
      </div>

      {/* Nội dung */}
      <div className="student-body">
        <img src={studentImg} alt="student" className="student-photo" />

        <div className="student-info">
          <p><b>Họ và tên:</b> Nguyễn Gia Khánh</p>
          <p><b>Sinh ngày:</b> 11 / 12 / 2005</p>
          <p><b>Địa chỉ:</b> 26/19/5d Lâm Hoành, Bình Tân, TP.HCM</p>
        </div>
      </div>

      {/* Mã sinh viên + mã vạch */}
      <div className="student-footer">
        <p className="student-id">3123410163</p>
        <div className="barcode"></div>
      </div>
    </div>
  );
}
