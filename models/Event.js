const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    name: {
      type: String,
      required: [true, "Event name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: [true, "Location ID is required"],
    },
    meetingLocation: {
      type: String,
      required: [true, "Meeting location is required"],
    },
    dateOfEvent: {
      type: Date,
      required: [true, "Date of event is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    participants: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
