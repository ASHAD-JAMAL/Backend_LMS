const Router = require("express").Router();
const {registerUser,loginUser} = require("../controller/StudentController");
// const {verifyToken} = require("../middleware/authMiddleware");

Router.post("/user-register",registerUser);
Router.post("/user-login",loginUser);

module.exports = Router;