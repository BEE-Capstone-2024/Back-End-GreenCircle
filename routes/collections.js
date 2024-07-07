const express = require("express");
const {
  getCollections,
  createCollection,
  updateCollection,
  getCollectionsById,
} = require("../controllers/collectionController");

const router = express.Router();

//GET: /api/collections/
router.get("/", getCollections);

//GET: /api/collections/:collectionId
router.get("/:collectionId", getCollectionsById);

//POST: /api/collections/:eventId
router.post("/:eventId", createCollection);

//PATCH: /api/collections/:collectionId/:materialType
router.patch("/:collectionId/:materialType", updateCollection);

//PATCH: /api/collections/:collectionId
router.patch("/:collectionId", updateCollection);

module.exports = router;
