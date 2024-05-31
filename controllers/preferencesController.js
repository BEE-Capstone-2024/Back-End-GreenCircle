require('dotenv').config()
const { get } = require('mongoose');
const Preferences = require('../models/Preferences')

const jwt = require('jsonwebtoken')

const createPreferences = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const { location, notifications, dataCollection } = req.body;

  try {
    const preferences = new Preferences({
      user: userId,
      location,
      notifications,
      dataCollection
    });

    const savedPreferences = await preferences.save();

    res.status(200).json({
      success: true,
      savedPreferences,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const getPreferences = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const preferences = await Preferences.findOne({ user: userId });

    if (!preferences) {
      res.status(404);
      return next(new Error("Preferences not found"));
    }

    res.status(200).json({
      success: true,
      preferences,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const { location, notifications, dataCollection } = req.body;

  try {
    const preferences = await Preferences.findOne({ user: userId });

    if (!preferences) {
      res.status(404);
      return next(new Error("Preferences not found"));
    }

    preferences.location = location;
    preferences.notifications = notifications;
    preferences.dataCollection = dataCollection;

    const savedPreferences = await preferences.save();

    res.status(200).json({
      success: true,
      savedPreferences,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
}

module.exports = {
  createPreferences,
  getPreferences,
  updatePreferences,
}  