// src/components/LiveTracking.jsx
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function LiveTracking() {
  const { scheduleId } = useParams();
  const [busLocations, setBusLocations] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (!scheduleId) return;

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.emit("joinScheduleRoom", scheduleId);

    socketRef.current.on("locationUpdate", (data) => {
      console.log("New location:", data);
      setBusLocations((prev) => ({
        ...prev,
        [data.bus_id]: data,
      }));
    });

    socketRef.current.on("studentList", (students) => {
      console.log("Student list:", students);
    });

    return () => {
      socketRef.current.emit("leaveBusTrackingRoom", scheduleId);
      socketRef.current.disconnect();
    };
  }, [scheduleId]);

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.values(busLocations).map((bus) => (
        <Marker key={bus.bus_id} position={[bus.lat, bus.lng]}>
          <Popup>
            <b>{bus.bus_id}</b><br />
            {bus.speed ? `Speed: ${bus.speed} km/h` : ""}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
