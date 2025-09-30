const admin = require('../Models/admin.model');

const getAllUsersService = async () => {
  try {
    const users = await admin.getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsersService,
};