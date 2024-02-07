const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Role = require("../utils/role");

dotenv.config();

const register = async (req, res) => {
  try {
    console.log(req.body);
    // Generate salt and password

    if (req.body.password != null) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      if (req.body.email != null) {
        const user = await new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          // profile: req.file != null ? req.file.filename : null,
        });
        await user.save();
        //return json to the user
        res.json({
          user_details: user,
          message: "User registered successfully",
        });
      } else {
        res.status(404).json({ message: "Please enter email" });
      }
    } else {
      res.status(404).json({ message: "Please enter password" });
    }
  } catch (error) {
    console.log("An Error Occured " + error.message);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!req.body.password) {
      return res.status(401).json({
        message: "Password is missing",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password, check login details",
      });
    }

    console.log("This is Role: " + Role.USER);

    const access_token = jwt.sign(
      {
        id: user._id,
        role: Role.USER,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    );

    if (user != null) {
      res.json({
        message: "Login success",
        ...user._doc,
        // JWT token
        token: access_token,
      });
    }
  } catch (error) {
    console.log("An error occurred: " + error.message);
    res.status(500).json({
      message: "An error occurred during login",
    });
  }
};

module.exports = {
  register,
  login,
};
