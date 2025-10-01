const user = require('../Models/user.model');

const createUserService = async (username, password, email, role) => {
    try {
       let result = await user.registerUser(
            username, 
            password, 
            email, 
            role
    );
    return result;
    } catch (error) {
        throw error;
    }
};

const loginUserService = async (email, password) => {
    try {
        let result = await user.loginUser(
            email,
            password
        );
        return result;
    } catch (error) {
        throw error;
    }
};
const editUserService = async (userid, userData) => {
    try {
        let result = await user.editUser(userid, userData);
        // trả về thông tin user đã được cập nhật
        let rows = await user.getUserById(userid);
        let data = null;
        if (rows.length > 0) {
            data = rows[0];
        }
        return data;
    } catch (error) {
        throw error;
    }
};
const deleteUserService = async (userid) => {
    try {
        let result = await user.deleteUser(userid);
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createUserService,
    loginUserService,
    editUserService,
    deleteUserService
};