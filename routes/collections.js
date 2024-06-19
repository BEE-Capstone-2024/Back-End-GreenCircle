const express = require("express");
const { createCollection } = require("../controllers/collectionController");

const router = express.Router();

//POST: /api/collection/:eventId
router.post("/:eventId", createCollection);

module.exports = router;
