import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getAllRoutes } from "./api/ManageList.api";

// Icons
const schoolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png", // Điểm đầu
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Điểm cuối
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const stopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Stop trung gian
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png", // Icon xe buýt
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const getRouteColor = (route_id) => {
  const colors = ["blue", "red", "green", "orange", "purple"];
  return colors[route_id % colors.length];
};

export default function TrackingMap() {
  const [routes, setRoutes] = useState([]);
  const [busPositions, setBusPositions] = useState({});
  const [busStates, setBusStates] = useState({}); // { route_id: {index, direction} }

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getAllRoutes();
        const data = res.data?.data || res.data || [];

        const routesData = data
          .map((route) => {
            const stops = (route.stop_points || [])
              .sort((a, b) => a.stop_order - b.stop_order)
              .map((s) => ({
                ...s,
                latitude: parseFloat(s.latitude),
                longitude: parseFloat(s.longitude),
              }));

            return {
              route_id: route.route_id,
              name: route.name,
              stops,
              coordinates: stops.map((s) => [s.latitude, s.longitude]),
              color: getRouteColor(route.route_id),
            };
          })
          .filter(
            (route) =>
              route.stops.length >= 2 &&
              route.stops[0].stop_name === "Điểm đầu" &&
              route.stops[route.stops.length - 1].stop_name === "Điểm cuối"
          );

        setRoutes(routesData);

        // Khởi tạo busPositions và busStates
        const positions = {};
        const states = {};
        routesData.forEach((route) => {
          positions[route.route_id] = route.coordinates[route.coordinates.length - 1]; // Bắt đầu từ Điểm cuối
          states[route.route_id] = {
            index: route.coordinates.length - 1,
            direction: -1, // -1: ngược từ cuối → đầu, 1: xuôi từ đầu → cuối
          };
        });
        setBusPositions(positions);
        setBusStates(states);
      } catch (err) {
        console.error("Lỗi fetch routes:", err);
      }
    };

    fetchRoutes();
    const interval = setInterval(fetchRoutes, 300000); // Poll API mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  // Animation xe buýt 2 chiều, dừng 3 giây mỗi stop
  useEffect(() => {
    if (routes.length === 0) return;

    const timeouts = [];

    routes.forEach((route) => {
      const moveBus = () => {
        setBusStates((prev) => {
          const state = prev[route.route_id];
          if (!state) return prev;
    
          let nextIndex = state.index + state.direction;
          let nextDirection = state.direction;
    
          // Nếu tới đầu hoặc cuối, đổi chiều nhưng giữ index hiện tại
          if (nextIndex < 0) {
            nextIndex = 0; // đứng đúng Điểm đầu
            nextDirection = 1;
          } else if (nextIndex >= route.coordinates.length) {
            nextIndex = route.coordinates.length - 1; // đứng đúng Điểm cuối
            nextDirection = -1;
          }
    
          // Cập nhật vị trí xe buýt
          setBusPositions((prevPos) => ({
            ...prevPos,
            [route.route_id]: route.coordinates[nextIndex],
          }));
    
          return {
            ...prev,
            [route.route_id]: { index: nextIndex, direction: nextDirection },
          };
        });
    
        // Gọi lại sau 3 giây
        const t = setTimeout(moveBus, 3000);
        timeouts.push(t);
      };
    
      moveBus();
    });
    

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [routes]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[10.762622, 106.660172]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {routes.map((route) => (
          <React.Fragment key={route.route_id}>
            <Polyline positions={route.coordinates} color={route.color} weight={5} opacity={0.6} />

            <Marker position={[route.stops[0].latitude, route.stops[0].longitude]} icon={schoolIcon}>
              <Popup>{route.stops[0].stop_name}</Popup>
            </Marker>

            <Marker
              position={[route.stops[route.stops.length - 1].latitude, route.stops[route.stops.length - 1].longitude]}
              icon={markerIcon}
            >
              <Popup>{route.stops[route.stops.length - 1].stop_name}</Popup>
            </Marker>

            {route.stops.slice(1, -1).map((stop) => (
              <Marker key={stop.stop_id} position={[stop.latitude, stop.longitude]} icon={stopIcon}>
                <Popup>{stop.stop_name}</Popup>
              </Marker>
            ))}

            {busPositions[route.route_id] && (
              <Marker position={busPositions[route.route_id]} icon={busIcon}>
                <Popup>Xe buýt tuyến {route.name}</Popup>
              </Marker>
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
