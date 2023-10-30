const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const chagersRoute = require("./routes/chagersRoutes");
const stationsRoute = require("./routes/stationRoutes");
const usersRoute = require("./routes/usersRoutes");
const cookieParser = require("cookie-parser");
// const path = require("path");

dotenv.config();

const app = express();

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

//middleware
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/stations", stationsRoute);
// app.use("/api/users", usersRoute);
app.use("/api/chagers", chagersRoute);

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
