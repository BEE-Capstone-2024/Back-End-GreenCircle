const Event = require("../models/Event");
const Location = require("../models/Location");
const getUserIdByToken = require("../middlewares/jwtUtils");

const getEvents = async (req, res) => {
  const eventId = req.params.eventId;

  if (typeof eventId == "undefined") {
    await Event.find({})
      .populate("user")
      .populate("location")
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    await Event.findOne({ _id: eventId })
      .populate("user")
      .populate("location")
      .populate("participants")
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

const getUserEvents = async (req, res) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

  await Event.find({})
    .populate("user")
    .populate("location")
    .exec()
    .then((results) => {
      res.status(results == null ? 404 : 200).json(
        results.filter((item) => {
          if (!item.participants || !item.participants.length) {
            return false;
          }
          return item.participants
            .map((obj) => obj.toString())
            .includes(userId);
        })
      );
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const createEvent = async (req, res, next) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

  const {
    name,
    description,
    location,
    meetingLocation,
    dateOfEvent,
    startTime,
    endTime,
    participants,
    peopleCheckIn,
    collections,
  } = req.body;

  try {
    const locationExists = await Location.findById(location);

    if (!locationExists) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const event = new Event({
      user: userId,
      name,
      description,
      location,
      meetingLocation,
      dateOfEvent,
      startTime,
      endTime,
      participants: participants || [userId],
      peopleCheckIn: peopleCheckIn || [],
      collections: collections || [],
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      savedEvent,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
    return next(error);
  }
};

const joinEvent = async (req, res, next) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

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
};



const updateEvent = async (req, res) => {
  const {
    name,
    description,
    location,
    meetingLocation,
    dateOfEvent,
    startTime,
    endTime,
  } = req.body;
  const id = req.params.eventId;

  let event;
  try {
    event = await Event.findById(id);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not access event by given id",
    });
    return;
  }
  if (!event) {
    res.status(404).json({
      success: false,
      message: "Event not found",
    });
    return;
  }

  event.name = name ?? event.name;
  event.description = description ?? event.description;
  event.location = location ?? event.location;
  event.meetingLocation = meetingLocation ?? event.meetingLocation;
  event.dateOfEvent = dateOfEvent ?? event.dateOfEvent;
  event.startTime = startTime ?? event.startTime;
  event.endTime = endTime ?? event.endTime;

  try {
    await event.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not save event",
    });
    return;
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const checkInUser = async (req, res) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

  const eventId = req.params.eventId;

  try {
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      res.status(404);
      return next(new Error("Event not found"));
    }

    if (!event.peopleCheckIn.includes(userId)) {
      event.peopleCheckIn.push(userId);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "User checked in successfully",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const addCollectionToEvent = async (req, res, next) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

  const eventId = req.params.eventId;
  const collectionId = req.params.collectionId; 

  try {
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    if (event.collections.includes(collectionId)) {
      res.status(400).json({
        success: false,
        message: "Collection already added to the event",
      });
      return;
    }

    event.collections.push(collectionId);
    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding collection to event",
    });
    return next(error);
  }
};

module.exports = {
  getEvents,
  getUserEvents,
  createEvent,
  joinEvent,
  updateEvent,
  checkInUser,
  addCollectionToEvent,
};
