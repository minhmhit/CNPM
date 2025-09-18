const express = require('express');
const router = express.Router();
const { createUser,loginUser } = require('../Controllers/user.controller');

// Đăng ký người dùng   
router.post('/register', createUser);
router.post('/login', loginUser);

module.exports = router;