const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Collection",
      required: [true, "Event ID is required"],
    },
    counts: {
      plastic: {
        type: Number,
        min: 0,
        default: 0,
      },
      tobacco: {
        type: Number,
        min: 0,
        default: 0,
      },
      metal: {
        type: Number,
        min: 0,
        default: 0,
      },
      glass: {
        type: Number,
        min: 0,
        default: 0,
      },
      fabric: {
        type: Number,
        min: 0,
        default: 0,
      },
      paper: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);
