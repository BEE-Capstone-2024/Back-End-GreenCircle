const express = require("express");
const {
  getCollections,
  createCollection,
  updateCollection,
  getCollectionsById,
  getCollectionStatus,
  updateCollectionStatus,
} = require("../controllers/collectionController");

const router = express.Router();

//GET: /api/collections/
router.get("/", getCollections);

//GET: /api/collections/:collectionId
router.get("/:collectionId", getCollectionsById);

//GET: /api/collections/:collectionId/status
router.get("/:collectionId/status", getCollectionStatus);

//POST: /api/collections/:eventId
router.post("/:eventId", createCollection);

// Update collection status
router.patch('/:collectionId/status', updateCollectionStatus);

//PATCH: /api/collections/:collectionId/:materialType
router.patch("/:collectionId/:materialType", updateCollection);

//PATCH: /api/collections/:collectionId
router.patch("/:collectionId", updateCollection);

module.exports = router;
