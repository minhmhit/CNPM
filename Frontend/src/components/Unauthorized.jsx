import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Unauthorized</h2>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
}
