import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Driver from "./Driver.jsx";
import Admin from "./Admin.jsx";
import Parents from "./Parents.jsx";
import Schedule from "./Schedule.jsx";
import Student from "./Student.jsx";
import Report from "./Report.jsx";
import Alert from "./Alert.jsx";
import ParentLayout from "./parent/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/driver"
        element={
            <Driver />
          // <ProtectedRoute roles={["driver"]}>
          // </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
            <Admin />
          // <ProtectedRoute roles={["admin"]}>
          // </ProtectedRoute>
        }
      />
      <Route
        path="/parents"
        element={
            <Parents />
          // <ProtectedRoute roles={["student"]}>
          // </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/driver/schedule" element={<Schedule />} />
      <Route path="/driver/student" element={<Student />} />
      <Route path="/driver/report" element={<Report />} />
      <Route path="/driver/alert" element={<Alert />} />
      <Route path="/parent/*" element={<ParentLayout />} />
    </Routes>
  );
}
