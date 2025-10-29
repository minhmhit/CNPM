const adminService = require('../Services/admin.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsersService();
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await adminService.getAllDriversService();
    res.json(drivers);
  } catch (error) {
    console.error("Error getting all drivers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const students = await adminService.getAllStudentsService();
    res.json(students);
  } catch (error) {
    console.error("Error getting all students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllClasses = async (req, res) => {
  try {
    const classes = await adminService.getAllClassesService();
    res.json(classes);
  } catch (error) {
    console.error("Error getting all classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllStudentsByClass = async (req, res) => {
  try {
    const className = req.params.className;
    const students = await adminService.getAllStudentsByClassService(className);
    res.json(students);
  } catch (error) {
    console.error("Error getting students by class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyprofile = async (req, res) => {
  try {
    const userid = req.params.userid;
    const profile = await adminService.getAdminProfileService(userid);
    res.json(profile);
  } catch (error) {
    console.error("Error getting admin profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getAllDrivers,
  getAllStudents,
  getAllClasses,
  getAllStudentsByClass,
  getMyprofile
};
