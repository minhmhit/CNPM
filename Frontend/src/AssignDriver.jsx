import React, { useState } from "react";
import "./AssignDriver.css";
import AssignForm from "./AssignForm";

export default function AssignDriver({ schedules, drivers, onAssign, onBack }) {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <AssignForm
        schedules={schedules}
        drivers={drivers}
        onAssign={onAssign}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="assign-driver-page">
      <h2>🚘 Danh sách tài xế</h2>
      <div className="driver-status">
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.phone}</td>
                <td className={d.status === "Rảnh" ? "free" : "busy"}>
                  {d.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="btn-container">
        <button className="a-assign-btn" onClick={() => setShowForm(true)}>
          👨‍✈️ Phân công tài xế
        </button>
      </div>
    </div>
  );
}
