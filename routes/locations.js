const express = require('express');
const {
    createLocation,
} = require('../controllers/locationController');

const router = express.Router();

//POST: /api/location
router.post("/", createLocation)

module.exports = router;