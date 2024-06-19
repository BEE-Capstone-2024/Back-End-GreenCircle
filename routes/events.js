const express = require("express");
const {
  getEvents,
  createEvent,
  joinEvent,
  updateEvent,
} = require("../controllers/eventController");

const router = express.Router();

//GET: /api/events/
router.get("/", getEvents);

//GET: /api/events/:eventId
router.get("/:eventId", getEvents);

//POST: /api/events/
router.post("/", createEvent);

//PUT: /api/events/:eventId
router.put("/:eventId", joinEvent);

//PATCH: /api/events/:eventId
router.patch("/:eventId", updateEvent);

module.exports = router;
