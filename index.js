const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");

const authRoute = require("./routes/auth");
const chagersRoute = require("./routes/chagersRoutes");
const stationsRoute = require("./routes/stationRoutes");
const usersRoute = require("./routes/usersRoutes");
const cookieParser = require("cookie-parser");
// const path = require("path");

dotenv.config();

const app = express();
//middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use("/api/auth", authRoute);
app.use("/api/stations", stationsRoute);
// app.use("/api/users", usersRoute);
app.use("/api/chagers", chagersRoute);

app.get("/", (req, res) => {
  res.send("This is ev back server working fine");
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, () => {
  connect();
  console.log("Example app listening on port !");
});

//mongodb+srv://gaurabsubedi299:fV6P31Zs2By5jUQ8@ev-backdb.icldypc.mongodb.net/?retryWrites=true&w=majority
