const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

let JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
  //get the headers from incoming request then get token
  var token = req.headers.authorization;

  if (token) {
    token = token.replace(/^Bearer\s+/, "");
    // console.log("Token Found " + token);

    //we have to verify the token (jsonwebtokens)
    //token
    //secret_key
    //call back function
    jwt.verify(token, JWT_SECRET, async (err, data) => {
      //if the token format is wrong
      if (err) {
        return res.status(401).json({
          message: "Invalid Token Used , try Again",
          success: false,
          input: token,
        });
      }
      //Create req data
      req.data = data;
      console.log("This is checking id inside data " + data.id);
      const userResult = await User.findById(data.id);
      req.role = userResult.isAdmin;
      console.log("role " + req.role);
      //After getting data value
      next();
    });
  } else {
    return res.status(401).json({
      message: "You are not authenticated , Please register or login ",
      status: "error",
    });
  }
  // if (!token) {
  //   return next(createError(401, "You are not authenticated!"));
  // }

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) return next(createError(403, "Token is not valid!"));
  //   req.user = user;
  //   next();
  // });
};

//Use the token for authorization roles check if user is admin or not
const verifyTokenWithAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.role != undefined) {
      // console.log("Request Data is not undefined");
      //var id = req.data.id;
      //we are gonna use the id to find the user in the database
      //We imort the user schema because we are making use of it to find out user in the database

      //Check if the user is admin
      var isAdmin = req.role;
      if (isAdmin) {
        console.log("This is Admin " + isAdmin);
        next();
      } else {
        console.log("Only ADMIN CAN UPLOAD");
        req.onlyAdmin = true;
        next();
        // next();
      }
    } else {
      console.log("Request Data is undefined");
      return res.json({
        message: "Invalid User",
        status: "Error",
      });
    }
  });
};

const verifyTokenWithManager = (req, res, next) => {
  // verifyToken(req, res, () => {
  //   if (req.role != undefined) {
  //     // console.log("Request Data is not undefined");
  //     //var id = req.data.id;
  //     //we are gonna use the id to find the user in the database
  //     //We imort the user schema because we are making use of it to find out user in the database

  //     //Check if the user is admin
  //     var isManager = req.role;
  //     if (isManager) {
  //       console.log("This is StatioN Manager " + isManager);
  //       next();
  //     } else {
  //       console.log("Only Station Manger CAN UPLOAD");
  //       req.onlyManager = true;
  //       next();
  //       // next();
  //     }
  //   } else {
  //     console.log("Request Data is undefined");
  //     return res.json({
  //       message: "Invalid User",
  //       status: "Error",
  //     });
  //   }
  // });
  verifyToken(req, res, next, () => {
    if (req.user.isManager) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return next(createError(401, "No token provided"));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(createError(403, "Token is not valid"));
//     req.user = user;
//     next();
//   });
// };

// const verifyUser = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, "You are not authorized!"));
//     }
// //   });
// };

// const verifyAdmin = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, "You are not authorized!"));
//     }
//   });
// };

// const verifyManger = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     if (req.user.isManger) {
//       next();
//     } else {
//       return next(createError(403, "You are not authorized!"));
//     }
//   });
// };

module.exports = {
  verifyToken,
  verifyTokenWithAuthorization,
  verifyTokenWithManager,
};
