import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import logo from "./pics/logo.png";
import accountIcon from "./pics/account-icon.png";
import "./App.css";
import SendMessage from "./SendMessage";
import ManageList from "./ManageList";

export default function Admin() {
  const [activePanel, setActivePanel] = useState("none");
  const navigate = useNavigate();

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
      // case "schedule":
      //   return <ScheduleManager />;
      // case "assignDriver":
      //   return <AssignDriver />;
      // case "tracking":
      //   return <Tracking />;
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
