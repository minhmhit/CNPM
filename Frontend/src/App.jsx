import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Driver from "./Driver.jsx";
import Admin from "./Admin.jsx";
import Parents from "./Parents.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/driver" element={<Driver />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/parents" element={<Parents />} />
    </Routes>
  );
}
