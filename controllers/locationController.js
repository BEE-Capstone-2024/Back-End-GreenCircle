require ('dotenv').config()
const { get } = require('mongoose');
const Location = require('../models/Location')

const jwt = require('jsonwebtoken')

const createLocation = async (req, res, next) => {
    // const token = req.headers["x-access-token"];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;

    const { location } = req.body;
    const { name, picture, longitude, latitude, radius, category } = location;

    try {
        const location = new Location({
            name,
            picture,
            location: {
                longitude,
                latitude,
                radius,
            },
            category
        });

        const savedLocation = await location.save();

        res.status(200).json({
            success: true,
            savedLocation,
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

const getLocations = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ success: false, message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const locations = await Location.find();
        res.status(200).json({
            success: true,
            locations,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Failed to authenticate token." });
        }
        console.log(error);
        return next(error);
    }
};

module.exports = {
    createLocation,
    getLocations,
}