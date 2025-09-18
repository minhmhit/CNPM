const {pool} = require('../config/connection_mysql');
const bcrypt = require('bcrypt');


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

module.exports ={
    registerUser,
};