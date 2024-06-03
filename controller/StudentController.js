const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const httpStatusCode = require("../constant/httpStatusCode");
const { getToken } = require("../middleware/authMiddleware");
const teacherModel = require("../models/teacherModel");
const studentModel = require("../models/studentModel");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      firstname,
      lastname,
      email,
      phone,
      username,
      password,
      role,
    } = req.body;

    //check if user with provided email or phone already exists
    let existingUser = await studentModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "User is already registered with this email.please sign in",
      });
    }
    existingUser = await teacherModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "User is already registered with this email.please sign in.",
      });
    }

    //Hash The Paasword
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "student") {
      user = await studentModel.create({
        firstname,
        lastname,
        email,
        phone,
        username,
        password,
        role,
      });
    } else if (role === "teacher") {
      user = await teacherModel.create({
        firstname,
        lastname,
        email,
        phone,
        username,
        password,
        role,
      });
    }
    if (!user) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "Error Occur While creating the User.",
      });
    }

    //send a congratulatory email to the user

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

const loginUser = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success:false,
                errors:errors.array(),
            });
        }

        const {email,password} = req.body;
        let user = await studentModel.findOne({email});
        if(!user){
            user = await teacherModel.findOne({email});
            if(!user){
                return res.status(httpStatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:"Invalid email Please register First!",
                });
            }
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(httpStatusCode.UNAUTHORIZED).json({
                success:false,
                message:"Invalid Password",
            });
        }

        const token = await getToken(user);

        return res.status(httpStatusCode.Ok).json({
            success:true,
            message:"Successfully Logged in!",
            data:{user,token,role:user.role},
        });
    }catch(error){
        console.error("Error in Logging in",error);
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Something Went Wrong!",
            error:error.message,
        });
    }
};

module.exports={
    registerUser,
    loginUser,
};