const express = require('express');
const {
    createLocation,
    getLocations,
} = require('../controllers/locationController');

const router = express.Router();

//POST: /api/location
router.post("/", createLocation)

//GET: /api/location
router.get("/", getLocations)

module.exports = router;