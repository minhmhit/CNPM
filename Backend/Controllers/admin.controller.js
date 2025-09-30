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
module.exports = {
  getAllUsers,
};