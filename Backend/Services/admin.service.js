const admin = require('../Models/admin.model');

const getAllUsersService = async () => {
  try {
    const users = await admin.getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
};
const getAllDriversService = async () => {
  try {
    const drivers = await admin.getAllDrivers();
    return drivers;
  } catch (error) {
    throw error;
  }
};
const getAllStudentsService = async () => {
  try {
    const students = await admin.getAllStudents();
    return students;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsersService,
  getAllDriversService,
  getAllStudentsService,
};