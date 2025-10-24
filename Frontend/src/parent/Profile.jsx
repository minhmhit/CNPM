import React from "react";
import "../Parents.css";

export default function Profile() {
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
          src="https://via.placeholder.com/120x150?text=Student" 
          alt="Student" 
          className="student-photo"
        />

        <div className="student-info">
          <p><b>Họ và tên:</b> Nguyễn Gia Khánh</p>
          <p><b>Sinh ngày:</b> 11 / 12 / 2005</p>
          <p><b>Lớp:</b> DCT1233</p>
          <p><b>Địa chỉ:</b> 26/19/5d Lâm Hoành, Bình Tân, TP.HCM</p>
        </div>
      </div>

      {/* Footer */}
      <div className="student-footer">
        <p className="student-id">3123410163</p>
        <div className="barcode"></div>
      </div>
    </div>
  );
}

