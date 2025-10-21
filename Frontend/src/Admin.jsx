import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import logo from "./pics/logo.png";
import accountIcon from "./pics/account-icon.png";
import "./App.css";
import SendMessage from "./SendMessage";
import ManageList from "./ManageList";
import ManageSchedule from "./ManageSchedule.jsx";
import AssignDriver from "./AssignDriver.jsx";

export default function Admin() {
  const [activePanel, setActivePanel] = useState("none");
  const navigate = useNavigate();

  // ✅ Dữ liệu mẫu (bạn có thể thay bằng dữ liệu thực từ API)
  const [schedules, setSchedules] = useState([
    { id: "LX01", route: "Bến xe A - Bến xe B", date: "2025-10-13", driver: null },
    { id: "LX02", route: "Bến xe C - Bến xe D", date: "2025-10-14", driver: null },
  ]);

  const [drivers, setDrivers] = useState([
    { id: "TX01", name: "Nguyễn Văn A", phone: "0901234567", status: "Rảnh" },
    { id: "TX02", name: "Trần Văn B", phone: "0902345678", status: "Bận" },
    { id: "TX03", name: "Lê Văn C", phone: "0903456789", status: "Rảnh" },
  ]);

  // ✅ Hàm xử lý khi phân công tài xế
  const handleAssign = (schedule, driver) => {
    // Cập nhật lịch trình được gán tài xế
    const updatedSchedules = schedules.map((s) =>
      s.id === schedule.id ? { ...s, driver: driver.name } : s
    );
    setSchedules(updatedSchedules);

    // Cập nhật trạng thái tài xế
    const updatedDrivers = drivers.map((d) =>
      d.id === driver.id ? { ...d, status: "Bận" } : d
    );
    setDrivers(updatedDrivers);

    // Sau khi phân công, có thể quay lại màn hình chính nếu muốn:
    // setActivePanel("none");
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      navigate("/");
      localStorage.clear();
    }
  };

  const renderContent = () => {
    switch (activePanel) {
      case "sendMessage":
        return <SendMessage onBack={() => setActivePanel("none")} />;
      case "schedule":
        return <ManageSchedule />;
      case "assignDriver":
        // ✅ Truyền đầy đủ props
        return (
          <AssignDriver
            schedules={schedules}
            drivers={drivers}
            onAssign={handleAssign}
            onBack={() => setActivePanel("none")}
          />
        );
      case "manageList":
        return <ManageList onBack={() => setActivePanel("none")} />;
      default:
        return <p>Chọn chức năng ở bên phải để thao tác.</p>;
    }
  };

  return (
    <div className="app">
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} className="bus-icon" alt="Logo" />
          <span className="navbar-title">Bus map</span>
        </div>
        <div className="account-info">
          <img src={accountIcon} alt="Account" />
          <span>Xin chào, Quản lý</span>
        </div>
      </div>

      <div className="center-box">
        <div className="display-info">{renderContent()}</div>

        <div className="side-panel">
          <button className="side-button" onClick={() => setActivePanel("schedule")}>
            Quản lý lịch trình xe
          </button>
          <button className="side-button" onClick={() => setActivePanel("assignDriver")}>
            Phân công tài xế xe
          </button>
          <button className="side-button" onClick={() => setActivePanel("tracking")}>
            Theo dõi vị trí xe
          </button>
          <button className="side-button" onClick={() => setActivePanel("sendMessage")}>
            Gửi tin nhắn
          </button>
          <button className="side-button" onClick={() => setActivePanel("manageList")}>
            Quản lý danh sách
          </button>

          <div className="logout-button">
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
      </div>
    </div>
  );
}
