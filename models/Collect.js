const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const collectSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: [true, "User is required"],
            unique: true,
        },
        eventId: {
            type: String,
            required: [true, "Event ID is required"]
        },
        collect: {
            plastic: {
                type: Number,
                required: [true, "plastic is required"]
            },
            tobacco: {
                type: Number,
                required: [true, "tobacco is required"]
            },
            metal: {
                type: Number,
                required: [true, "metal is required"]
            },
            glass: {
                type: Number,
                required: [true, "glass is required"]
            },
            fabric: {
                type: Number,
                required: [true, "fabric is required"]
            },
            paper: {
                type: Number,
                required: [true, "paper is required"]
            },
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Collect", collectSchema);