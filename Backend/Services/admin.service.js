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

const getAllClassesService = async () => {
  try {
    const classes = await admin.getAllClasses()
    return classes;
    
  } catch (error) {
    throw error;
  }
}
const getAllStudentsByClassService = async (className) => {
  try {
    const students = await admin.getAllStudentsByClass(className);
    return students;
  } catch (error) {
    throw error;
  }
}

const getAdminProfileService = async (userid) => {
  try {
    const profile = await admin.getAdminProfile(userid);
    return profile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsersService,
  getAllDriversService,
  getAllStudentsService,
  getAllClassesService,
  getAllStudentsByClassService,
  getAdminProfileService
};