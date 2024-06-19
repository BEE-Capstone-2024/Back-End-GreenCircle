const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    picture: {
      type: String,
      required: [true, "Picture is required"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    radius: {
      type: Number,
      required: [true, "Radius is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    amenities: {
      type: [{ type: String }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
