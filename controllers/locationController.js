require("dotenv").config();
const Location = require("../models/Location");

const jwt = require("jsonwebtoken");

const createLocation = async (req, res, next) => {
  // const token = req.headers["x-access-token"];
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // const userId = decoded.id;

  const { name, picture, longitude, latitude, radius, category, amenities } =
    req.body;

  try {
    const location = new Location({
      name,
      picture,
      longitude,
      latitude,
      radius,
      category,
      amenities,
    });

    const savedLocation = await location.save();

    if (savedLocation == null) {
      res.status(404).json(savedLocation);
    } else {
      res.status(201).json({ url: req.originalUrl, data: savedLocation });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
    return next(error);
  }
};

const getLocations = async (req, res, next) => {
  // const token = req.headers["x-access-token"];

  // if (!token) {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "No token provided." });
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // } catch (error) {
  //   if (error.name === "JsonWebTokenError") {
  //     return res
  //       .status(401)
  //       .json({ success: false, message: "Failed to authenticate token." });
  //   }
  //   console.log(error);
  //   return next(error);
  // }

  const id = req.params.locationId;

  if (typeof id == "undefined") {
    await Location.find({})
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    await Event.findOne({ _id: id })
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

const updateLocation = async (req, res) => {
  const { name, picture, longitude, latitude, radius, category, amenities } =
    req.body;
  const id = req.params.locationId;

  let location;
  try {
    location = await Location.findById(id);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  if (!location) {
    res.status(404).json(location);
    return;
  }

  location.name = name ?? location.name;
  location.picture = picture ?? location.picture;
  location.longitude = longitude ?? location.longitude;
  location.latitude = latitude ?? location.latitude;
  location.radius = radius ?? location.radius;
  location.category = category ?? location.category;
  location.amenities = amenities ?? location.amenities;

  try {
    await location.save();
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  res.status(200).json({ location: location.toObject({ getters: true }) });
};

module.exports = {
  createLocation,
  getLocations,
  updateLocation,
};
