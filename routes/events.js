const express = require("express");
const {
  getEvents,
  getUserEvents,
  createEvent,
  joinEvent,
  updateEvent,
} = require("../controllers/eventController");

const router = express.Router();

//GET: /api/events/user/
router.get("/user", getUserEvents);

//GET: /api/events/:eventId
router.get("/:eventId", getEvents);

//GET: /api/events/
router.get("/", getEvents);

//POST: /api/events/
router.post("/", createEvent);

//PUT: /api/events/:eventId
router.put("/:eventId", joinEvent);

//PATCH: /api/events/:eventId
router.patch("/:eventId", updateEvent);

module.exports = router;
