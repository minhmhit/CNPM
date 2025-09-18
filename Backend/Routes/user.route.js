const express = require('express');
const router = express.Router();
const { createUser } = require('../Controllers/user.controller');

// Đăng ký người dùng   
router.post('/register', createUser);

module.exports = router;