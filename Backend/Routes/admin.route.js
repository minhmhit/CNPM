const express = require("express");
const router = express.Router();
const { getAllUsers, getAllDrivers, getAllStudents, getAllClasses, getAllStudentsByClass } = require("../controllers/admin.controller");
// api admin
router.get("/getAllUsers", getAllUsers);
router.get("/getAllDrivers", getAllDrivers);
router.get("/getAllStudents", getAllStudents);
router.get("/getAllClasses", getAllClasses);
router.get("/getAllStudentsByClass/:className", getAllStudentsByClass);

module.exports = router;
