import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard-home">
      <img 
        src="/src/pics/backgroud.png" 
        alt="Background" 
        className="dashboard-bg"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}
