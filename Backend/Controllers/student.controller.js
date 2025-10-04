const studentService = require("../Services/student.service");
const addStudentInfo = async (req, res) => {
    try {
        const { student_id, className, pickup_location, dropoff_location } =
          req.body;
        const Student = await studentService.addStudentInfo(student_id, 
            {
                className,
                pickup_location,
                dropoff_location,
            });
        res.status(200).json(Student);
    } catch (error) {
        console.error("lỗi khi thêm thông tin học sinh:", error);
        res.status(500).json({ message: "lỗi khi thêm thông tin học sinh", error: error.message });
    }
};
module.exports = {
    addStudentInfo
};