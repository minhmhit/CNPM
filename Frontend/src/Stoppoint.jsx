// import React, { useEffect, useState } from "react";
// import { getAllRoutes } from "./api/Route.api";
// import { getStopPointsByRouteId } from "./api/Stoppoint.api";
// import "./StopPoint.css";

// export default function StopPoint() {
//   const [routes, setRoutes] = useState([]);
//   const [stopPoints, setStopPoints] = useState([]);
//   const [selectedRoute, setSelectedRoute] = useState(null);

//   // Lấy toàn bộ Route khi vào trang
//   useEffect(() => {
//     loadRoutes();
//   }, []);

//   const loadRoutes = async () => {
//     const res = await getAllRoutes();
//     console.log("Routes fetched:", res);
//     if (res && res.data) {
//       setRoutes(res.data);
//     }
//   };

//   const handleSelectRoute = async (route_id) => {
//     setSelectedRoute(route_id);

//     const res = await getStopPointsByRouteId(route_id);
//     if (res && res.data) {
//       setStopPoints(res.data);
//     } else {
//       setStopPoints([]);
//     }
//   };

//   return (
//     <div className="sp-container">
//       <h2>Danh sách các tuyến (Route)</h2>

//       {/* Bảng Route */}
//       <table className="sp-table">
//         <thead>
//           <tr>
//             <th>Route ID</th>
//             <th>Tên route</th>
//             <th>Mô tả</th>
//             <th>Chọn</th>
//           </tr>
//         </thead>
//         <tbody>
//           {routes.map((r) => (
//             <tr key={r.route_id}>
//               <td>{r.route_id}</td>
//               <td>{r.name}</td>
//               <td>{r.description}</td>
//               <td>
//                 <button
//                   className="sp-btn"
//                   onClick={() => handleSelectRoute(r.route_id)}
//                 >
//                   Xem StopPoints
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Phần stop point */}
//       {selectedRoute && (
//         <>
//           <h2>Danh sách StopPoint của Route {selectedRoute}</h2>

//           <table className="sp-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Tên trạm</th>
//                 <th>Thứ tự</th>
//                 <th>Longitude</th>
//                 <th>Latitude</th>
//               </tr>
//             </thead>

//             <tbody>
//               {stopPoints.length > 0 ? (
//                 stopPoints.map((s) => (
//                   <tr key={s.stop_id}>
//                     <td>{s.stop_id}</td>
//                     <td>{s.stop_name}</td>
//                     <td>{s.stop_order}</td>
//                     <td>{s.longitude}</td>
//                     <td>{s.latitude}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5">Không có StopPoint cho route này</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// }
