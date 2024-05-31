const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const preferencesSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: [true, "User is required"],
            unique: true,
        },
        location: {
            type: Boolean,
            required: [true, "Location is required"],
            default: true,
        },
        notifications: {
            type: Boolean,
            required: [true, "Notifications is required"],
            default: true,
        },
        dataCollection: {
            type: Boolean,
            required: [true, "Data Collection is required"],
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Preferences", preferencesSchema);
