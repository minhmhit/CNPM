const userService = require("../Services/user.service");
const createUser = async (req,res) => {
    const {username, password, email} = req.body;
    const data = await userService.createUserService(
        username, 
        password,
        email
    );
    return res.status(200).json({
        message: "User created successfully",
        data: data
    });
};

const loginUser = async (req,res) => {
    const {username, password} = req.body;
    console.log(req.body);
    const data = await userService.loginUserService(
        username,
        password
    );
    return res.status(200).json({
        message: "Dang nhap thanh cong",
        data: data
    });
};

module.exports ={
    createUser,
    loginUser,
}