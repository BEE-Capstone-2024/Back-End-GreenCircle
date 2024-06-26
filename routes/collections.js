const express = require("express");
const {
  getCollections,
  createCollection,
  updateCollection,
} = require("../controllers/collectionController");

const router = express.Router();

//GET: /api/collections/:collectionId
router.get("/:collectionId", getCollections);

//GET: /api/collections/
router.get("/", getCollections);

//POST: /api/collections/:eventId
router.post("/:eventId", createCollection);

//PATCH: /api/collections/:collectionId/:materialType
router.patch("/:collectionId/:materialType", updateCollection);

//PATCH: /api/collections/:collectionId
router.patch("/:collectionId", updateCollection);

module.exports = router;
