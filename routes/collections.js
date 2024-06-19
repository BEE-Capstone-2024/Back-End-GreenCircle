const express = require("express");
const {
  getCollections,
  createCollection,
  updateCollection,
  countUpCollection,
} = require("../controllers/collectionController");

const router = express.Router();

//GET: /api/collections/:collectionId
router.get("/:collectionId", getCollections);

//GET: /api/collections/
router.get("/", getCollections);

//POST: /api/collections/:eventId
router.post("/:eventId", createCollection);

//PATCH: /api/collections/:collectionId
router.patch("/:collectionId", updateCollection);

//PATCH: /api/collections/countup/:collectionId
router.patch("/:collectionId", countUpCollection);

module.exports = router;
