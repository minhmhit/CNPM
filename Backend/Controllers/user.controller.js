const userService = require("../Services/user.service");
const createUser =async (req,res) => {
    console.log(req.body);
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
}
module.exports ={
    createUser,
}