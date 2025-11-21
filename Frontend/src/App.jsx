import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Driver from "./Driver.jsx";
import Admin from "./Admin.jsx";
import Parents from "./Parents.jsx";
// import Schedule from "./Schedule.jsx";
import Session from "./Session.jsx";
// import Report from "./Report.jsx";
import Alert from "./Alert.jsx";
// import StopPoint from "./Stoppoint.jsx";
import ParentLayout from "./parent/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
// import LiveTracking from "./LiveTracking";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/driver"
        element={
          <ProtectedRoute roles={["driver"]}>
            <Driver />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parents"
        element={
          <ProtectedRoute roles={["student"]}>
            <Parents />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* <Route path="/driver/schedule" element={<Schedule />} /> */}
      <Route path="/driver/session" element={<Session />} />
      {/* <Route path="/driver/report" element={<Report />} /> */}
      <Route path="/driver/alert" element={<Alert />} />
      <Route path="/parent/*" element={<ParentLayout />} />

      {/* <Route path="/stoppoint" element={<StopPoint />} /> */}
      {/* <Route path="/tracking/:scheduleId" element={<LiveTracking />} /> */}
    
    </Routes>
  );
}
