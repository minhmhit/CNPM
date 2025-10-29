import React, { useState } from "react";
import MapView from "./MapView";

export default function App() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const routes = [
    { from: [10.762622, 106.660172], to: [10.776889, 106.700806] },
    { from: [10.7805, 106.699], to: [10.7901, 106.675] },
    { from: [10.805, 106.68], to: [10.82, 106.69] },
    { from: [10.76, 106.67], to: [10.75, 106.68] },
    { from: [10.77, 106.66], to: [10.785, 106.68] },
    { from: [10.79, 106.66], to: [10.81, 106.70] },
  ];

  const handleSelect = (index) => {
    setShowAll(false);
    const r = routes[index];
    setFrom(r.from);
    setTo(r.to);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          margin: "10px",
        }}
      >
        <h4>Chọn tuyến</h4>
        {routes.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{ margin: "4px" }}
          >
            Tuyến {i + 1}
          </button>
        ))}
        <button
          onClick={() => {
            setFrom(null);
            setTo(null);
            setShowAll(true);
          }}
          style={{ marginTop: "6px" }}
        >
          Hiển thị tất cả
        </button>
      </div>

      <MapView
        from={from}
        to={to}
        routes={routes}
        showAll={showAll}
        message="Hãy chọn tuyến để bắt đầu"
      />
    </div>
  );
}
