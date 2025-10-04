const attendanceService = require("../Services/attendance.service");

const checkin = async (req, res) => {
    try {
        const { student_id, route_id, timestamp } = req.body;
        await attendanceService.checkin(student_id, route_id, timestamp);
        res.status(200).json({ message: "Điểm danh thành công" });
    } catch (error) {
        console.error("lỗi khi điểm danh:", error);
        res.status(500).json({ message: "Điểm danh thất bại", error: error.message });
    }
};

const checkout = async (req, res) => {
    try {
        const { student_id, route_id, timestamp } = req.body;
        await attendanceService.checkout(student_id, route_id, timestamp);
        res.status(200).json({ message: "Điểm danh thành công" });
    } catch (error) {
        console.error("lỗi khi điểm danh:", error);
        res.status(500).json({ message: "Điểm danh thất bại", error: error.message });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const { student_id } = req.params;
        const attendance = await attendanceService.getStudentAttendance(student_id);
        res.status(200).json(attendance);
    } catch (error) {
        console.error("lỗi khi lấy thông tin điểm danh của học sinh:", error);
        res.status(500).json({ message: "lỗi khi lấy thông tin điểm danh của học sinh" });
    }
};

const getRouteAttendance = async (req, res) => {
    try {
        const { route_id } = req.params;
        const attendance = await attendanceService.getRouteAttendance(route_id);
        res.status(200).json(attendance);
    } catch (error) {
        console.error("lỗi khi lấy thông tin điểm danh theo tuyến:", error);
        res.status(500).json({ message: "lỗi khi lấy thông tin điểm danh theo tuyến" });
    }
};

module.exports = {
    checkin,
    checkout,
    getStudentAttendance,
    getRouteAttendance
};
