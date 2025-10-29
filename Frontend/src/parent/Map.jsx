import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function Map() {
  const [busPosition, setBusPosition] = useState([10.8231, 106.6297]);
  
  const stops = [
    { id: 1, name: "Điểm đón: Ngã tư Bình Phước", lat: 10.8150, lng: 106.6250 },
    { id: 2, name: "Điểm đón: Chợ Bình Tân", lat: 10.8180, lng: 106.6270 },
    { id: 3, name: "Trường Đại học Sài Gòn", lat: 10.8231, lng: 106.6297 },
    { id: 4, name: "Điểm trả: Công viên Lâm Văn Bền", lat: 10.8280, lng: 106.6350 },
  ];

  const routePath = stops.map(stop => [stop.lat, stop.lng]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition(prev => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001,
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-view">
      <h2 className="map-title">Bản đồ theo dõi xe</h2>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={[10.8231, 106.6297]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <Polyline positions={routePath} color="#6a42f4" weight={4} opacity={0.7} />
          <Marker position={busPosition} icon={busIcon}>
            <Popup>
              <strong>🚌 Xe Bus Tuyến B01</strong><br />
              Tài xế: Nguyễn Văn A<br />
              Đang di chuyển
            </Popup>
          </Marker>
          {stops.map(stop => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopIcon}>
              <Popup><strong>{stop.name}</strong></Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Thông tin xe & tài xế */}
      {/* <div className="map-info-grid">
        <div className="map-info-item">
          <p className="map-info-label">🚌 Xe bus</p>
          <p className="map-info-value">Tuyến B01 - BKS: 51B-12345</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">👨‍✈️ Tài xế</p>
          <p className="map-info-value">Nguyễn Văn A</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">📱 Hotline</p>
          <p className="map-info-value">0901234567</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">📊 Trạng thái</p>
          <p className="map-info-value status-active">Đang di chuyển</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">🚦 Tốc độ</p>
          <p className="map-info-value">35 km/h</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">📍 Điểm tiếp theo</p>
          <p className="map-info-value">Trường ĐH Sài Gòn</p>
        </div>
      </div> */}

      {/* Danh sách điểm */}
      <div className="map-stops-list">
        <h3 className="map-stops-title">📍 Các điểm trên tuyến</h3>
        <ul>
          {stops.map((stop, index) => (
            <li key={stop.id} className="map-stop-item">
              <strong>Điểm {index + 1}:</strong> {stop.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
