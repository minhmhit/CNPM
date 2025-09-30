import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
