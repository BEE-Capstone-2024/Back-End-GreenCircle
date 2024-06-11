const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const eventSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: [true, "User is required"],
            unique: true,
        },
        eventName: {
            type: String,
            required: [true, "Event name is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        locationId: {
            type: String,
            required: [true, "Location ID is required"]
        },
        meetingLocation: {
            longitude: {
                type: Number,
                required: [true, "Longitude is required"]
            },
            latitude: {
                type: Number,
                required: [true, "Latitude is required"]
            }
        },
        dateOfEvent: {
            type: Date,
            required: [true, "Date of event is required"]
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"]
        },
        endTime: {
            type: String,
            required: [true, "End time is required"]
        },
        participants: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);