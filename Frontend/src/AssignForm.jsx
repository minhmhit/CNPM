import React, { useState } from "react";
import "./AssignForm.css";

export default function AssignForm({ schedules, drivers, onAssign, onBack }) {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");

  const availableDrivers = drivers.filter((d) => d.status === "Rảnh");
  const unassignedSchedules = schedules.filter((s) => !s.driver);

  const handleAssign = (e) => {
    e.preventDefault();

    if (!selectedSchedule || !selectedDriver) {
      alert("Vui lòng chọn lịch trình và tài xế!");
      return;
    }

    const schedule = schedules.find((s) => s.id === selectedSchedule);
    const driver = drivers.find((d) => d.id === selectedDriver);

    onAssign(schedule, driver);
    alert(`✅ Đã phân công tài xế ${driver.name} cho xe ${schedule.id}`);

    setSelectedSchedule("");
    setSelectedDriver("");
  };

  return (
    <div className="assign-form-page">
      <h2>👨‍✈️ Phân công tài xế</h2>

      <form className="assign-form" onSubmit={handleAssign}>
        <label>Chọn lịch trình:</label>
        <select
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
        >
          <option value="">-- Chọn lịch trình --</option>
          {unassignedSchedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.route} ({s.date})
            </option>
          ))}
        </select>

        <label>Chọn tài xế:</label>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">-- Chọn tài xế rảnh --</option>
          {availableDrivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.phone})
            </option>
          ))}
        </select>
        <div className="ass-button-container">
          <button type="submit" className="assign-btn">Phân công</button>
          <button className="ass-back-btn" onClick={onBack}>
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}
