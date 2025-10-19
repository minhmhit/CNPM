const express = require("express");
const router = express.Router();
const { getAllUsers, getAllDrivers, getAllStudents } = require("../controllers/admin.controller");
// api admin
router.get("/getAllUsers", getAllUsers);
router.get("/getAllDrivers", getAllDrivers);
router.get("/getAllStudents", getAllStudents);

module.exports = router;
