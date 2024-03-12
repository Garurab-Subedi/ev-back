const Station = require("../models/stationModel");

const createStation = async (req, res, next) => {
  const newStation = new Station(req.body);
  if (req.onlyAdmin) {
    res.json({
      message: "Only Admin Can do this",
      status: "Error",
    });
    return;
  }
  try {
    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (error) {
    res.status(404).json({
      message: "Error creating station",
      error,
    });
  }
};

const updateStation = async (req, res, next) => {
  if (req.onlyAdmin) {
    res.json({
      message: "Only Admin Can do this",
      status: "Error",
    });
    return;
  }
  try {
    const updateStation = await Station.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(201).json(updateStation);
  } catch (error) {
    res.status(404).json({
      message: "Error creating station",
      error,
    });
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const deleteStation = await Station.findByIdAndDelete(req.params.id);
    res.status(201).json(deleteStation);
  } catch (error) {
    res.status(404).json({
      message: "Error creating station",
      error,
    });
  }
};

const getStation = async (req, res, next) => {
  try {
    const getStation = await Station.findById(req.params.id);
    res.status(201).json(getStation);
  } catch (error) {
    res.status(404).json({
      message: "Error creating station",
      error,
    });
  }
};

const getStations = async (req, res, next) => {
  try {
    const getStations = await Station.find();
    res.status(201).json(getStations);
  } catch (error) {
    res.status(404).json({
      message: "Error creating station",
      error,
    });
  }
};

module.exports = {
  getStation,
  getStations,
  createStation,
  updateStation,
  deleteStation,
};
