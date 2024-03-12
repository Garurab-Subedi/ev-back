const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Role = require("../utils/role");
const { createError } = require("../utils/error");

dotenv.config();

const register = async (req, res, next) => {
  // try {
  //   // Generate salt and password

  //   if (req.body.password != null) {
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //     if (req.body.email != null) {
  //       const user = await new User({
  //         username: req.body.username,
  //         email: req.body.email,
  //         password: hashedPassword,
  //         // profile: req.file != null ? req.file.filename : null,
  //       });
  //       await user.save();
  //       //return json to the user
  //       res.json({
  //         user_details: user,
  //         message: "User registered successfully",
  //       });
  //     } else {
  //       res.status(404).json({ message: "Please enter email" });
  //     }
  //   } else {
  //     res.status(404).json({ message: "Please enter password" });
  //   }
  // } catch (error) {
  //   console.log("An Error Occured " + error.message);
  // }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    if (req.body.email != null) {
      //We Have To Check If The User Exist
      const user = await User.findOne({ email: req.body.email });
      !user &&
        res.status(404).json({
          message: "User Does Not Exist,Register User",
        });

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword &&
        res.status(404).json({
          message: "Invalid Credentials,  Check Login Details",
        });

      console.log("This is Role : " + Role.USER);

      //We are going to use our token to know if user is ADMIN or Not
      const access_token = jwt.sign(
        {
          id: user.id,
          role: Role.USER,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hrs" }
      );

      //Lets Go to Postman
      //INSTALL JWT
      if (user != null) {
        res.json({
          message: "Success",
          ...user._doc,
          //JWT
          token: access_token,
        });
      }
      res.send("This is login RestApi routes");
    } else {
      res.status(400).json({
        message: "Email Is Required Here",
      });
    }
  } catch (error) {
    console.log("An Error Occured " + error.message);
  }
};

module.exports = {
  register,
  login,
};
