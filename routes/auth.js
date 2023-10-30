const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller");

const app = express();

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);

module.exports = router;
