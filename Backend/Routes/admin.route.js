const express = require("express");
const router = express.Router();
const { 
    getAllUsers, getAllDrivers, 
    getAllStudents, getAllClasses, 
    getAllStudentsByClass, getMyprofile 
    } = require("../controllers/admin.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Apply authentication and admin authorization middleware to all admin routes
router.use(authMiddleware);
router.use(isAdmin);
// api admin
router.get("/getAllUsers", getAllUsers);
router.get("/getAllDrivers", getAllDrivers);
router.get("/getAllStudents", getAllStudents);
router.get("/getAllClasses", getAllClasses);
router.get("/getAllStudentsByClass/:className", getAllStudentsByClass);
router.get("/profile/:userid", getMyprofile);

module.exports = router;
