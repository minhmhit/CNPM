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

module.exports = {
  getAllUsers,
  getAllDrivers,
  getAllStudents,
};