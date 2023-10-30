const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photos: {
      type: [String],
    },
    desc: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    // status: {
    //   choices: [
    //     ("online", "online"),
    //     ("offline", "offline"),
    //     ("maintenance", "maintenance"),
    //   ],
    //   default: "online",
    // },
    chagers: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Station", StationSchema);
