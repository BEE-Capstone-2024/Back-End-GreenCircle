const express = require("express");
const {
  getLocations,
  createLocation,
  updateLocation,
} = require("../controllers/locationController");

const router = express.Router();

//GET: /api/locations
router.get("/", getLocations);

//GET: /api/locations/:locationId
router.get("/:locationId", getLocations);

//POST: /api/locations
router.post("/", createLocation);

//PATCH: /api/locations/:locationId
router.patch("/:locationId", updateLocation);

module.exports = router;
