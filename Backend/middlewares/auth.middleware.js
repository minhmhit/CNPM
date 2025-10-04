const { pool } = require("../config/connection_mysql");
// decode token middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET



const authMiddleware = async (req, res, next) => {
  try {
     const whitelist = ["/login", "/register"];
     if (whitelist.includes(req.path)) {
       return next();
     }
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token, truy cập bị từ chối",
      });
    }

    const decoded = jwt.verify(
      token, secretKey||'jwt_secret_key'
    );

    const [rows] = await pool.query(
      "SELECT userid, username, email, role, isActive FROM users WHERE userid = ?",
      [decoded.userid]
    );

    if (rows.length === 0 || !rows[0].isActive) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối",
    });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối",
    });
  }
  next();
};

const isDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối",
    });
  }
  next();
};

module.exports = {
  isAdmin,
  isStudent,
  isDriver,
  authMiddleware
};
