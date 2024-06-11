require('dotenv').config()
const { get } = require('mongoose');
const Event = require('../models/Event')

const jwt = require('jsonwebtoken')

const createEvent = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const { eventName, description, locationId, meetingLocation, dateOfEvent, startTime, endTime, participants } = req.body;

  try {
    const event = new Event({
      user: userId,
      eventName,
      description,
      locationId,
      meetingLocation,
      dateOfEvent,
      startTime,
      endTime,
      participants: participants || [userId]
    });

    const savedEvent = await event.save();

    res.status(200).json({
      success: true,
      savedEvent,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
}

const joinEvent = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const eventId = req.params.eventId;
  
    try {
      const event = await Event.findOne({ _id: eventId });
  
      if (!event) {
        res.status(404);
        return next(new Error("Event not found"));
      }
  
      if (event.participants.includes(userId)) {
        res.status(400).json({
          success: false,
          message: "User already joined the event",
        });
        return;
      }
  
      event.participants.push(userId);
  
      const updatedEvent = await event.save();
  
      res.status(200).json({
        success: true,
        updatedEvent,
      });
  
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

module.exports = {
    createEvent,
    joinEvent,
}