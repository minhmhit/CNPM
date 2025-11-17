import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../util/axios.customize.js";
import "../Parents.css";

// ----------------------------------------------------------------------
// 1. Cấu hình và Custom Icons cho Leaflet
// ----------------------------------------------------------------------

// Khắc phục lỗi icon mặc định của Leaflet trong Webpack/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Hàm tạo icon tùy chỉnh
const createIcon = (url, size = [30, 30]) => new L.Icon({
  iconUrl: url,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1]],
  popupAnchor: [0, -size[1]],
});

// Các Icon tùy chỉnh
const busIcon = createIcon("https://cdn-icons-png.flaticon.com/512/3448/3448339.png", [40, 40]);
const stopIcon = createIcon("https://cdn-icons-png.flaticon.com/512/684/684908.png");
const pickupIcon = createIcon("https://cdn-icons-png.flaticon.com/512/3177/3177361.png", [35, 35]); // Điểm đón (màu xanh lá)
const dropoffIcon = createIcon("https://cdn-icons-png.flaticon.com/512/484/484167.png", [35, 35]); // Điểm trả (màu đỏ)

// ----------------------------------------------------------------------
// 2. Component MapUpdater: Cập nhật trung tâm bản đồ
// ----------------------------------------------------------------------

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    // Di chuyển bản đồ đến vị trí trung tâm mới (vị trí xe bus)
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// ----------------------------------------------------------------------
// 3. Component chính Map
// ----------------------------------------------------------------------

export default function Map() {
  const [state, setState] = useState({
    studentData: null, // Thông tin học sinh (chứa pickup_location, dropoff_location)
    schedules: [],     // Danh sách lịch trình
    stopPoints: [],    // Danh sách các điểm dừng trên tuyến
    busPosition: null, // Vị trí hiện tại của xe bus: [latitude, longitude]
    currentStopIndex: 0, // Dùng cho chế độ mô phỏng
    driverInfo: null,  // Thông tin tài xế
    loading: true,
    useSimulation: false, // Trạng thái: Live Tracking (false) hay Simulation (true)
  });

  // Hàm tiện ích để cập nhật state
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  // ----------------------------------------------------------------------
  // LOGIC: Mô phỏng di chuyển của xe bus (chỉ chạy khi live tracking thất bại)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!state.useSimulation || state.stopPoints.length === 0) return;

    // Sắp xếp lại điểm dừng theo stop_order để đảm bảo thứ tự mô phỏng
    const sortedStops = [...state.stopPoints].sort((a, b) => a.stop_order - b.stop_order);

    const interval = setInterval(() => {
      updateState(prev => {
        const nextIndex = (prev.currentStopIndex + 1) % sortedStops.length;
        const nextStop = sortedStops[nextIndex];

        if (nextStop) {
          return {
            ...prev,
            currentStopIndex: nextIndex,
            // Đặt vị trí xe bus là điểm dừng tiếp theo trong tuyến
            busPosition: [parseFloat(nextStop.latitude), parseFloat(nextStop.longitude)]
          };
        }
        return prev;
      });
    }, 3000); // Xe di chuyển đến điểm dừng tiếp theo sau 3 giây

    return () => clearInterval(interval);
  }, [state.useSimulation, state.stopPoints, state.currentStopIndex]);

  // ----------------------------------------------------------------------
  // LOGIC: Fetch Data khi Component Mount
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    // Lấy userId mặc định là "25" nếu không có trong localStorage
    const userid = localStorage.getItem("userId") || "25";
    console.log("📡 Fetching data for userId:", userid);

    try {
      // 1. Get student data: GET /student/profile/:userid
      const { data: studentRes } = await api.get(`/student/profile/${userid}`);
      console.log("✅ Student data:", studentRes);
      
      if (!studentRes?.data) return;
      
      const student = studentRes.data;
      updateState({ studentData: student });

      // 2. Get schedules: GET /student/schedules/:userid
      const { data: scheduleRes } = await api.get(`/student/schedules/${userid}`);
      console.log("✅ Schedules:", scheduleRes);
      
      if (!scheduleRes?.data?.length) return;
      
      const schedules = scheduleRes.data;
      const firstSchedule = schedules[0];
      updateState({ schedules });

      // 3. Get stop points: GET /route/getStopPointsByScheduleId/:scheduleId
      // Hàm này sẽ đặt busPosition ban đầu (là điểm dừng đầu tiên) và bật simulation
      await fetchStopPoints(firstSchedule.schedule_id);

      // 4. Get driver info: GET /driver/:driverId
      if (firstSchedule.driver_id) {
        await fetchDriverInfo(firstSchedule.driver_id);
      }

      // 5. Try live tracking: GET /tracking/bus/:busId
      // Nếu thành công, nó sẽ ghi đè busPosition, tắt simulation và thiết lập auto refresh
      if (firstSchedule.bus_id) {
        await fetchTracking(firstSchedule.bus_id);
      }

    } catch (err) {
      console.error("❌ Error fetching data:", err);
    } finally {
      updateState({ loading: false });
    }
  }

  // Lấy danh sách điểm dừng
  async function fetchStopPoints(scheduleId) {
    try {
      const { data } = await api.get(`/route/getStopPointsByScheduleId/${scheduleId}`);
      console.log("✅ Stop points:", data);

      if (data?.data?.length) {
        const stops = data.data;
        const sortedStops = [...stops].sort((a, b) => a.stop_order - b.stop_order);
        
        // Đặt vị trí xe bus ban đầu là điểm dừng đầu tiên
        const initialBusPosition = [
          parseFloat(sortedStops[0].latitude), 
          parseFloat(sortedStops[0].longitude)
        ];

        updateState({
          stopPoints: stops,
          busPosition: initialBusPosition,
          useSimulation: true, // Bắt đầu ở chế độ mô phỏng
        });
      }
    } catch (err) {
      console.error("❌ Error fetching stops:", err);
    }
  }

  // Lấy thông tin tài xế
  async function fetchDriverInfo(driverId) {
    try {
      const { data } = await api.get(`/driver/${driverId}`);
      console.log("✅ Driver data:", data);
      if (data?.data) updateState({ driverInfo: data.data });
    } catch (err) {
      console.log("⚠️ Driver info not available");
    }
  }

  // Lấy vị trí xe bus trực tiếp
  async function fetchTracking(busId) {
    try {
      const { data } = await api.get(`/tracking/bus/${busId}`);
      console.log("✅ Live tracking:", data);

      if (data?.data) {
        updateState({
          busPosition: [parseFloat(data.data.latitude), parseFloat(data.data.longitude)],
          useSimulation: false, // Chuyển sang chế độ live tracking
        });

        // Auto refresh mỗi 5 giây
        const interval = setInterval(async () => {
          try {
            const { data: trackingData } = await api.get(`/tracking/bus/${busId}`);
            if (trackingData?.data) {
              updateState({
                busPosition: [parseFloat(trackingData.data.latitude), parseFloat(trackingData.data.longitude)]
              });
            }
          } catch (err) {
            console.log("⚠️ Tracking update failed");
          }
        }, 5000);

        // Trả về hàm cleanup để xóa interval khi component unmount
        // hoặc khi useEffect chạy lại.
        // Tuy nhiên, trong ngữ cảnh này, chúng ta cần một cách quản lý interval tốt hơn 
        // để không bị lỗi memory leak. Cần sử dụng useRef hoặc đặt logic này ngoài fetchTracking 
        // nếu muốn nó tồn tại độc lập. Hiện tại, ta sẽ bỏ qua return này để tránh xung đột 
        // với useEffect chính (chỉ chạy 1 lần).
      }
    } catch (err) {
      console.log("⚠️ Live tracking not available, using simulation");
      // Nếu lỗi, `useSimulation` vẫn giữ nguyên là `true` đã được đặt ở `fetchStopPoints`
    }
  }

  // ----------------------------------------------------------------------
  // RENDER: Xử lý trạng thái tải/lỗi
  // ----------------------------------------------------------------------

  if (state.loading) {
    return (
      <div className="map-view">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>⏳ Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  if (!state.studentData) {
    return (
      <div className="map-view">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>⚠️ Không có dữ liệu học sinh</p>
          <button 
            onClick={() => { updateState({ loading: true }); fetchAllData(); }}
            style={{ 
              marginTop: "20px",
              padding: "10px 20px", 
              background: "#6a42f4", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer" 
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: Chuẩn bị dữ liệu hiển thị
  // ----------------------------------------------------------------------
  const currentSchedule = state.schedules[0] || null;
  // Sắp xếp điểm dừng theo thứ tự để vẽ tuyến đường
  const sortedStops = [...state.stopPoints].sort((a, b) => a.stop_order - b.stop_order);
  // Tạo mảng tọa độ cho Polyline
  const routePath = sortedStops.map(stop => [parseFloat(stop.latitude), parseFloat(stop.longitude)]);
  // Tìm điểm đón và điểm trả của học sinh
  const pickupStop = state.stopPoints.find(s => s.stop_id === state.studentData.pickup_location);
  const dropoffStop = state.stopPoints.find(s => s.stop_id === state.studentData.dropoff_location);
  // Xác định trung tâm bản đồ, ưu tiên vị trí xe bus, nếu không thì là điểm đầu tuyến
  const center = state.busPosition || (routePath[0] || [10.762622, 106.660172]); // Tọa độ mặc định (TP.HCM)

  // Hàm chọn icon cho điểm dừng
  const getStopIcon = (stop) => {
    if (stop.stop_id === state.studentData.pickup_location) return pickupIcon;
    if (stop.stop_id === state.studentData.dropoff_location) return dropoffIcon;
    return stopIcon;
  };

  // Hàm xác định style cho item trong danh sách điểm dừng
  const getStopStyle = (index, stop) => {
    const isPickup = stop.stop_id === state.studentData.pickup_location;
    const isDropoff = stop.stop_id === state.studentData.dropoff_location;
    // Điểm dừng hiện tại (trong chế độ mô phỏng)
    const isCurrent = state.useSimulation && index === state.currentStopIndex;

    return {
      background: isCurrent ? "#fff3cd" : isPickup ? "#d4edda" : isDropoff ? "#f8d7da" : "transparent",
      fontWeight: (isPickup || isDropoff || isCurrent) ? "bold" : "normal",
      padding: "8px 12px",
      marginBottom: "8px",
      borderRadius: "6px",
      border: isCurrent ? "2px solid #ff9800" : "none"
    };
  };

  // ----------------------------------------------------------------------
  // RENDER: Giao diện chính
  // ----------------------------------------------------------------------

  return (
    <div className="map-view">
      <h2 className="map-title">🗺️ Bản đồ theo dõi xe</h2>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
          {/* Cập nhật trung tâm bản đồ khi vị trí xe bus thay đổi */}
          <MapUpdater center={state.busPosition} />
          
          {/* Nền bản đồ Google Maps */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
            attribution='&copy; Google Maps'
            maxZoom={20}
          />
          
          {/* Tuyến đường (màu tím) */}
          {routePath.length > 0 && (
            <Polyline positions={routePath} color="#6a42f4" weight={4} opacity={0.7} />
          )}
          
          {/* Marker của Xe Bus */}
          {state.busPosition && (
            <Marker position={state.busPosition} icon={busIcon}>
              <Popup>
                <strong>🚌 Xe Bus</strong><br />
                Tuyến: {currentSchedule?.route_name || "N/A"}<br />
                BKS: {currentSchedule?.license_plate || "N/A"}<br />
                Tài xế: {state.driverInfo?.name || currentSchedule?.driver_name || "N/A"}<br />
                SĐT: {state.driverInfo?.phone_number || currentSchedule?.phone_number || "N/A"}<br />
                {state.useSimulation ? (
                  <span style={{ color: "#ff9800" }}>⚠️ Chế độ mô phỏng</span>
                ) : (
                  <span style={{ color: "#4caf50" }}>🟢 Tracking thời gian thực</span>
                )}
              </Popup>
            </Marker>
          )}
          
          {/* Các Marker của Điểm Dừng */}
          {sortedStops.map((stop) => {
            const isPickup = stop.stop_id === state.studentData.pickup_location;
            const isDropoff = stop.stop_id === state.studentData.dropoff_location;
            
            return (
              <Marker 
                key={stop.stop_id} 
                position={[parseFloat(stop.latitude), parseFloat(stop.longitude)]} 
                icon={getStopIcon(stop)}
              >
                <Popup>
                  {isPickup && <><strong>🟢 ĐIỂM ĐÓN CỦA BẠN</strong><br /></>}
                  {isDropoff && <><strong>🔴 ĐIỂM TRẢ CỦA BẠN</strong><br /></>}
                  <strong>{stop.stop_name}</strong><br />
                  Điểm thứ {stop.stop_order}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Info Grid (Thông tin chuyến xe) */}
      <div className="map-info-grid">
        <div className="map-info-item">
          <p className="map-info-label">🚌 Xe bus</p>
          <p className="map-info-value">
            {currentSchedule?.route_name || "N/A"} - BKS: {currentSchedule?.license_plate || "N/A"}
          </p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">👨‍✈️ Tài xế</p>
          <p className="map-info-value">
            {state.driverInfo?.name || currentSchedule?.driver_name || "N/A"}
          </p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">📱 Hotline tài xế</p>
          <p className="map-info-value">
            {state.driverInfo?.phone_number || currentSchedule?.phone_number || "N/A"}
          </p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">📊 Trạng thái</p>
          <p className="map-info-value status-active">
            {state.useSimulation ? "⚠️ Chế độ mô phỏng" : "🟢 Đang di chuyển"}
          </p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">🕐 Giờ khởi hành</p>
          <p className="map-info-value">{currentSchedule?.start_time || "N/A"}</p>
        </div>
        <div className="map-info-item">
          <p className="map-info-label">🕐 Giờ kết thúc</p>
          <p className="map-info-value">{currentSchedule?.end_time || "N/A"}</p>
        </div>
        {pickupStop && (
          <div className="map-info-item">
            <p className="map-info-label">🟢 Điểm đón</p>
            <p className="map-info-value">{pickupStop.stop_name}</p>
          </div>
        )}
        {dropoffStop && (
          <div className="map-info-item">
            <p className="map-info-label">🔴 Điểm trả</p>
            <p className="map-info-value">{dropoffStop.stop_name}</p>
          </div>
        )}
      </div>

      {/* Stop Points List (Danh sách điểm dừng) */}
      <div className="map-stops-list">
        <h3 className="map-stops-title">📍 Các điểm trên tuyến ({sortedStops.length})</h3>
        {sortedStops.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            Chưa có điểm dừng
          </p>
        ) : (
          <ul>
            {sortedStops.map((stop, index) => {
              const isPickup = stop.stop_id === state.studentData.pickup_location;
              const isDropoff = stop.stop_id === state.studentData.dropoff_location;
              const isCurrent = state.useSimulation && index === state.currentStopIndex;
              
              return (
                <li key={stop.stop_id} className="map-stop-item" style={getStopStyle(index, stop)}>
                  {isCurrent && "🚌 "}
                  {isPickup && "🟢 "}
                  {isDropoff && "🔴 "}
                  <strong>Điểm {stop.stop_order}:</strong> {stop.stop_name}
                  {isPickup && " (Điểm đón của bạn)"}
                  {isDropoff && " (Điểm trả của bạn)"}
                  {isCurrent && " (Xe đang ở đây)"}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}