const express = require('express');
const router = express.Router();
const { createUser,loginUser, editUser, deleteUser } = require('../Controllers/user.controller');

// Đăng ký người dùng   
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/edit/:id', editUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;