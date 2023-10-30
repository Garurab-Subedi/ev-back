const express = require("express");
const router = express.Router();
const Token = require("../utils/verifyToken");

const {
  createStation,
  updateStation,
  deleteStation,
  getStation,
  getStations,
} = require("../controller/stationController"); 

//create
router.post("/", Token.verifyTokenWithAuthorization, createStation);
//update
router.put("/:id", Token.verifyTokenWithAuthorization, updateStation);
//delete
router.delete("/:id",Token.verifyTokenWithAuthorization, deleteStation);
//get
router.get("/:id", getStation);
//get all
router.get("/", getStations);

module.exports = router;
