const userService = require("../Services/user.service");
const createUser = async (req,res) => {
    const {username, password, email,role} = req.body;
    const data = await userService.createUserService(
        username, 
        password,
        email,
        role
    );
    return res.status(200).json({
        message: "User created successfully",
        data: data
    });
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    const data = await userService.loginUserService(
        email,
        password
    );
    return res.status(200).json({
        message: "Dang nhap thanh cong",
        data: data
    });
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = id;
        const { username, password, email, role } = req.body;
        const data = await userService.editUserService(userid, { username, password, email, role });
        return res.status(200).json({
            message: "User updated successfully",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
}
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = id;
        const data = await userService.deleteUserService(userid);
        return res.status(200).json({
            message: "User deleted successfully",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
}

module.exports ={
    createUser,
    loginUser,
    editUser,
    deleteUser
}