// Updated TrackingMap.jsx with button linking to Endpoint.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "./TrackingMap.css";

const markerIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", iconSize: [40, 40], iconAnchor: [20, 40] });
const busIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png", iconSize: [45, 45], iconAnchor: [22, 45] });
const schoolIcon = new L.Icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png", iconSize: [45, 45], iconAnchor: [22, 45] });

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);
  useMapEvents({ click(e) { const lat = e.latlng.lat; const lng = e.latlng.lng; setPosition([lat, lng]); onSelect(lat, lng); }, });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function TrackingMap() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");

  const GOOGLE_API_KEY = "AIzaSyB8FQH6ZOUxtGEsaddoDxM3499xnXSvgrI";

  const endPoint = [10.7805, 106.64];
  const route1 = [[10.762622, 106.660172], [10.763854975395247, 106.6600512168673], [10.762168560272698, 106.65707054862804], [10.768640126925412, 106.65256733903563], [10.774879681701933, 106.64789126599446], endPoint];
  const route2 = [[10.750532038855104, 106.65937040209847], [10.754347686831947, 106.65818934584922], [10.753251483513734, 106.6507615785175], [10.754136878810883, 106.6418777706542], [10.766110540870592, 106.64230664775823], [10.768935243914974, 106.63788843983923], [10.772940374468853, 106.63763111357682], endPoint];
  const route3 = [[10.7642, 106.683], [10.767206697435249, 106.67457871028707], [10.767965572720788, 106.66793111517443], [10.775849330634234, 106.663642344134], [10.780191633190547, 106.65871025743749], [10.777704302497757, 106.65605121939242], [10.78955055764148, 106.65236702137278], [10.77479536425587, 106.64816402575313], endPoint];
  const route4 = [[10.790983, 106.621372], [10.790119672031679, 106.6216118076273], [10.789845654126426, 106.62322006913364], [10.788559874466493, 106.62283407974], [10.787527031085261, 106.62763921660294], [10.787990757123836, 106.62905625197787], [10.78769565881839, 106.63354044949251], [10.786452027063678, 106.63658547693119], [10.781751474152836, 106.63596368803186], endPoint];
  const route5 = [[106.6650, 10.7523], [106.6701, 10.7550], endPoint];

  const [bus1Index, setBus1Index] = useState(0);
  const [bus2Index, setBus2Index] = useState(0);
  const [bus3Index, setBus3Index] = useState(0);
  const [bus4Index, setBus4Index] = useState(0);
  const [bus5Index, setBus5Index] = useState(0);

  const [bus1Position, setBus1Position] = useState(route1[0]);
  const [bus2Position, setBus2Position] = useState(route2[0]);
  const [bus3Position, setBus3Position] = useState(route3[0]);
  const [bus4Position, setBus4Position] = useState(route4[0]);
  const [bus5Position, setBus5Position] = useState(route4[0]);

  useEffect(() => {
    const t1 = setInterval(() => setBus1Index((i) => (i + 1 < route1.length ? i + 1 : 0)), 5000);
    const t2 = setInterval(() => setBus2Index((i) => (i + 1 < route2.length ? i + 1 : 0)), 7200);
    const t3 = setInterval(() => setBus3Index((i) => (i + 1 < route3.length ? i + 1 : 0)), 6000);
    const t4 = setInterval(() => setBus4Index((i) => (i + 1 < route4.length ? i + 1 : 0)), 5000);
    const t5 = setInterval(() => setBus5Index((i) => (i + 1 < route4.length ? i + 1 : 0)), 5000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, []);

  useEffect(() => setBus1Position(route1[bus1Index]), [bus1Index]);
  useEffect(() => setBus2Position(route2[bus2Index]), [bus2Index]);
  useEffect(() => setBus3Position(route3[bus3Index]), [bus3Index]);
  useEffect(() => setBus4Position(route4[bus4Index]), [bus4Index]);
  useEffect(() => setBus5Position(route4[bus5Index]), [bus5Index]);

  const handleSelectLocation = async (lat, lng) => {
    setCoords({ lat, lng });
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`);
      const data = await res.json();
      setAddress(data.results?.length ? data.results[0].formatted_address : "Không tìm thấy địa chỉ Google");
    } catch {
      setAddress("Lỗi khi gọi Google API");
    }
  };

  return (
    <div className="tracking-map-container">
      <MapContainer center={[10.762622, 106.660172]} zoom={13} className="tracking-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Polyline positions={route1} color="blue" weight={5} opacity={0.6} />
        <Marker position={bus1Position} icon={busIcon} />

        <Polyline positions={route2} color="red" weight={5} opacity={0.6} />
        <Marker position={bus2Position} icon={busIcon} />

        <Polyline positions={route3} color="green" weight={5} opacity={0.6} />
        <Marker position={bus3Position} icon={busIcon} />

        <Polyline positions={route4} color="orange" weight={5} opacity={0.6} />
        <Marker position={bus4Position} icon={busIcon} />

        <Polyline positions={route5} color="purple" weight={5} opacity={0.6} />
        <Marker position={bus5Position} icon={busIcon} />

        <LocationMarker onSelect={handleSelectLocation} />
        <Marker position={endPoint} icon={schoolIcon} />
      </MapContainer>

      {coords && (
        <div className="tracking-info">
          <p><b>Lat:</b> {coords.lat}</p>
          <p><b>Lng:</b> {coords.lng}</p>
          <p><b>Địa chỉ Google:</b> {address}</p>
        </div>
      )}

      {/* Nút dẫn sang Endpoint.jsx */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/stoppoint")}
          style={{ padding: "10px 18px", borderRadius: "8px", cursor: "pointer", background: "#007bff", color: "white", fontSize: "16px" }}>
          Stoppoint
        </button>
      </div>
    </div>
  );
}
