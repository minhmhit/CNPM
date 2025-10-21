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
      localStorage.removeItem("admin");
      navigate("/");
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
    <div className="dashboard-container admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="logo" className="header-logo" />
          <span className="header-title">Bus Map - Admin</span>
        </div>
        <div className="header-right">
          <img src={accountIcon} alt="account" className="header-user-icon-img" />
          <span>Xin chào, Quản lý</span>
        </div>
      </header>

      <div className="dashboard-content">
        <main className="view-area">
          <div className="admin-content-wrapper">{renderContent()}</div>
        </main>

        <aside className="dashboard-sidebar">
          <button className={`sidebar-btn ${activePanel === "schedule" ? "active" : ""}`} onClick={() => setActivePanel("schedule")}>
            Quản lý lịch trình xe
          </button>
          <button className={`sidebar-btn ${activePanel === "assignDriver" ? "active" : ""}`} onClick={() => setActivePanel("assignDriver")}>
            Phân công tài xế xe
          </button>
          {/* Nút này chưa có chức năng nên tôi tạm ẩn đi */}
          {/* <button className={`sidebar-btn ${activePanel === "tracking" ? "active" : ""}`} onClick={() => setActivePanel("tracking")}>
            Theo dõi vị trí xe
          </button> */}
          <button className={`sidebar-btn ${activePanel === "sendMessage" ? "active" : ""}`} onClick={() => setActivePanel("sendMessage")}>
            Gửi tin nhắn
          </button>
          <button className={`sidebar-btn ${activePanel === "manageList" ? "active" : ""}`} onClick={() => setActivePanel("manageList")}>
            Quản lý danh sách
          </button>

          <div className="sidebar-footer">
            <button className="sidebar-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
