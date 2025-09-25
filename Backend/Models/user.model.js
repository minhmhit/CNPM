const {pool} = require('../config/connection_mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const registerUser = async (username, password, email) => {
   try {
     const hashedPassword = await bcrypt.hash(password, 10);
     const [rows] = await pool.query(
       `INSERT INTO user (username, password, email) 
        VALUES (?, ?, ?)`,
       [username, hashedPassword, email]
     );
     
     return rows.insertId;
   } catch (error) {
     console.error("Error registering user:", error);
     throw error;
   }
}

const loginUser = async (username, password) => {
   try {
     const [rows] = await pool.query(
       `SELECT * FROM user WHERE username = ?`,
       [username]
     );
     if (rows.length > 0) {
       const user = rows[0];
       let result = {
        id: user.id,
        username: user.username,
        email: user.email
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

module.exports ={
    registerUser,
    loginUser,
};