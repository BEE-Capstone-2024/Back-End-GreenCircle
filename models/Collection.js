const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };
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
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    counts: [
      {
        material: {
          type: String,
          required: [true, "Material type is required"],
          trim: true,
        },
        count: { type: Number, min: 0, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  },
  opts
);

collectionSchema.virtual("totalCount").get(function () {
  return this.counts
    .map((element) => element.count)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
});

module.exports = mongoose.model("Collection", collectionSchema);
