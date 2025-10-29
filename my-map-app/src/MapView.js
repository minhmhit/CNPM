import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function RoutingMachine({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;
    let controls = [];

    try {
      // Tuyến đi
      const forward = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        lineOptions: { styles: [{ color: "#0078FF", weight: 5 }] },
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
      }).addTo(map);

      // Tuyến về
      const backward = L.Routing.control({
        waypoints: [L.latLng(to[0], to[1]), L.latLng(from[0], from[1])],
        lineOptions: { styles: [{ color: "#008000", weight: 4, opacity: 0.6 }] },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        createMarker: () => null,
      }).addTo(map);

      controls.push(forward, backward);
    } catch (e) {
      console.warn("⚠️ Lỗi khi tạo tuyến:", e);
    }

    return () => {
      controls.forEach((ctrl) => {
        try {
          if (map && ctrl && ctrl._container) {
            map.removeControl(ctrl);
          }
        } catch (e) {
          console.warn("⚠️ Lỗi khi huỷ tuyến:", e);
        }
      });
    };
  }, [map, from, to]);

  return null;
}

function MultiRouting({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !routes?.length) return;
    const controls = [];
    const colorList = [
      "#1E90FF", "#0066CC", "#00CED1",
      "#4169E1", "#483D8B", "#6A5ACD"
    ];
    let isUnmounted = false;

    async function showRoutesSequentially() {
      for (let i = 0; i < routes.length; i++) {
        if (isUnmounted) break;
        const r = routes[i];
        const color = colorList[i % colorList.length];
        try {
          // Tuyến đi
          const forward = L.Routing.control({
            waypoints: [
              L.latLng(r.from[0], r.from[1]),
              L.latLng(r.to[0], r.to[1]),
            ],
            lineOptions: { styles: [{ color, weight: 5, opacity: 0.9 }] },
            addWaypoints: false,
            fitSelectedRoutes: i === 0,
            showAlternatives: false,
            createMarker: () => null,
          }).addTo(map);

          // Tuyến về
          const backward = L.Routing.control({
            waypoints: [
              L.latLng(r.to[0], r.to[1]),
              L.latLng(r.from[0], r.from[1]),
            ],
            lineOptions: {
              styles: [{ color, weight: 4, opacity: 0.5, dashArray: "6 6" }],
            },
            addWaypoints: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
            createMarker: () => null,
          }).addTo(map);

          controls.push(forward, backward);
        } catch (e) {
          console.warn(`⚠️ Lỗi khi thêm tuyến ${i + 1}:`, e);
        }
        await delay(600);
      }
    }

    showRoutesSequentially();

    return () => {
      isUnmounted = true;
      controls.forEach((ctrl) => {
        try {
          if (map && ctrl && ctrl._container) {
            map.removeControl(ctrl);
          }
        } catch (e) {
          console.warn("⚠️ Lỗi khi huỷ tuyến:", e);
        }
      });
    };
  }, [map, routes]);

  return null;
}

export default function MapView({ from, to, routes, showAll, message }) {
  return (
    <MapContainer
      center={[10.77, 106.68]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {showAll ? (
        <MultiRouting routes={routes} />
      ) : from && to ? (
        <RoutingMachine from={from} to={to} />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "16px",
            color: "#333",
            zIndex: 1000,
          }}
        >
          {message || "Hãy chọn tuyến để bắt đầu"}
        </div>
      )}
    </MapContainer>
  );
}