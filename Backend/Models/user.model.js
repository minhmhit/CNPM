const {pool} = require('../config/connection_mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const registerUser = async (username, password, email, role) => {
  //check if user already exists
  const [existingUser] = await pool.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (username, password, email, role) 
                 VALUES (?, ?, ?, ?)`;
    const [rows] = await pool.query(sql, [
      username,
      hashedPassword,
      email,
      role,
    ]);
    //chèn người dùng vừa tạo vào bảng tuong ứng với role
    if (role === "driver") {
      const driverSql = `INSERT INTO drivers (userid, name) VALUES (?, ?)`;
      await pool.query(driverSql, [rows.insertId, username]);
    } else if (role === "student") {
      const studentSql = `INSERT INTO students (userid, name) VALUES (?, ?)`;
      await pool.query(studentSql, [rows.insertId, username]);
    } else if (role === "admin") {
      const adminSql = `INSERT INTO admins (userid, name) VALUES (?, ?)`;
      await pool.query(adminSql, [rows.insertId, username]);
    }

    return { userId: rows.insertId, username, email, role };
  } catch (error) {
     console.error("Error registering user:", error);
     throw error;
   }
   
}

const loginUser = async (email, password) => {
   try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
     if (rows.length > 0) {
       const user = rows[0];
       let result = {
        id: user.userid,
        username: user.username,
        email: user.email,
        role: user.role
       }
       const isMatch = await bcrypt.compare(password, user.password);
       if (isMatch) {
        // tạo access token
        const payload = {
          email : user.email,
          username: user.username,
          id: user.id
        }
        const accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES,
          }
        )
         return { result, accessToken };
       } else {
         throw new Error("Mat khau khong dung");
       }
     } else {
       throw new Error("Ten dang nhap khong ton tai");
     }
   } catch (error) {
     console.error("Error logging in user:", error);
     throw error;
   }
};

const editUser = async (userid, userData) => {
  try {
    // Chỉ cập nhật các trường có trong userData
    const fields = [];
    const values = [];
    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.role) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    if (fields.length === 0) throw new Error('No fields to update');
    values.push(userid);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE userid = ?`;
    const [result] = await pool.query(sql, values);
   
  } catch (error) {
    console.error('Error editing user:', error);
    throw error;
  }
};

const deleteUser = async (userid) => {
  try {
    //chỉnh isActive thành 0
    const sql = 'UPDATE users SET isActive = 0 WHERE userid = ?';
    const [result] = await pool.query(sql, [userid]);
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
const getUserById = async (userid) => {
  try {
    const sql = 'SELECT userid, username, email, role, isActive FROM users WHERE userid = ?';
    const rows = await pool.query(sql, [userid]);
    return rows;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

module.exports ={
  registerUser,
  loginUser,
  editUser,
  deleteUser,
  getUserById
};