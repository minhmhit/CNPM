const user = require('../Models/user.model');

const createUserService = async (username, password, email) => {
    try {
       let result = await user.registerUser(
            username, 
            password, 
            email
    );
    return result;
    } catch (error) {
        throw error;
    }
};

const loginUserService = async (username, password) => {
    try {
        let result = await user.loginUser(
            username,
            password
        );
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUserService,
    loginUserService
}; 