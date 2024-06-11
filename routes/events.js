const express = require('express');
const {
    createEvent,
    joinEvent,
}= require('../controllers/eventController');

const router = express.Router();

//POST: /api/events/
router.post("/", createEvent)

//PUT: /api/events/:id
router.put("/:eventId", joinEvent)

module.exports = router;