import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./TrackingMap.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}></Marker>
  );
}

export default function TrackingMap() {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");

  const handleLocationSelect = async (lat, lng) => {
    setCoords({ lat, lng });
    console.log("Vĩ độ:", lat, " | Kinh độ:", lng);

    // Gọi Google Geocoding API
    const apiKey = "YOUR_API_KEY"; // Thay bằng API key của bạn
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      setAddress(data.results[0].formatted_address);
    } else {
      setAddress("Không tìm thấy địa chỉ!");
    }
  };

  return (
    <div className="tracking-map-container">
  <MapContainer
    center={[10.762622, 106.660172]}
    zoom={13}
    className="tracking-map"
  >
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationMarker onLocationSelect={handleLocationSelect} />
  </MapContainer>

  {coords && (
    <div className="tracking-info">
      <p><b>Vĩ độ (lat):</b> {coords.lat}</p>
      <p><b>Kinh độ (lng):</b> {coords.lng}</p>
      <p><b>Địa chỉ (Google API):</b> {address}</p>
    </div>
  )}
</div>

  );
}
