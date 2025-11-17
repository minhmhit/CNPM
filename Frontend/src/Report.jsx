// import { SidePanel, Navbar } from "./Driver.jsx"
// import React, {useState} from "react"
// import "./Report.css"
// import Schedule from "./Schedule.jsx";

// export default function Report(){

//     const currentDriver = { id: 1, name: "Nguyễn Văn Tài"}; // mock data tài xế hiện hành
//     const currentSchedule = {id: 5} //mock data ca hiện hành

//     const [reportData, setReportData] = useState({
//         driver: currentDriver.name,
//         schedule_id: currentSchedule.id,
//         type: "pickup",
//         description: "",
//         time: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setReportData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Tự động thêm thời gian, ca gửi
//         const sendTime = new Date().toLocaleString();

//         const finalReport = { ...reportData, time: sendTime };

//         const confirmSend = window.confirm(
//         `Xác nhận gửi báo cáo?\n\nNgười gửi: ${finalReport.driver}\nCa ID: ${finalReport.schedule_id}\nLoại: ${finalReport.type}\nThời gian: ${finalReport.time}`
//         );

//         if (confirmSend) {
//         alert("Đã gửi báo cáo thành công!");
//         } else {
//         alert("Đã hủy gửi báo cáo.");
//         }
//     };

//     return (
//         <div className="app">
//             <Navbar />
//             <div className="driver-center-box">
//                 <div className="driver-display-info">
//                     <div className="driver-report-container">
//                         <h2 className="driver-report-title">Gửi báo cáo lên hệ thống</h2>
//                             <form className="driver-report-form" onSubmit={handleSubmit}>
//                                 {/* Người gửi */}
//                                 <div className="driver-form-group">
//                                 <label>Người gửi:</label>
//                                 <input type="text" value={reportData.driver} disabled />
//                                 </div>

//                                 {/* Loại báo cáo */}
//                                 <div className="driver-form-group">
//                                 <label>Loại báo cáo:</label>
//                                 <div className="driver-radio-group">
//                                     <label>
//                                     <input
//                                         type="radio"
//                                         name="type"
//                                         value="pickup"
//                                         checked={reportData.type === "pickup"}
//                                         onChange={handleChange}
//                                     />
//                                     Đón học sinh
//                                     </label>
//                                     <label>
//                                     <input
//                                         type="radio"
//                                         name="type"
//                                         value="dropoff"
//                                         checked={reportData.type === "dropoff"}
//                                         onChange={handleChange}
//                                     />
//                                     Trả học sinh
//                                     </label>
//                                 </div>
//                                 </div>

//                                 {/* Mô tả */}
//                                 <div className="driver-form-group">
//                                 <label>Mô tả chi tiết:</label>
//                                 <textarea
//                                     name="description"
//                                     rows="6"
//                                     value={reportData.description}
//                                     onChange={handleChange}
//                                     placeholder="Nhập nội dung báo cáo..."
//                                     required
//                                 ></textarea>
//                                 </div>

//                                 {/* Nút gửi */}
//                                 <button type="submit" className="driver-submit-btn">
//                                 Gửi báo cáo 📄
//                                 </button>
//                             </form>
//                     </div>
//                 </div>
//                 <SidePanel />
//             </div>
//         </div>
//     )
// }