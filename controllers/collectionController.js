const Collection = require("../models/Collection");
const getUserIdByToken = require("../middlewares/jwtUtils");

const getCollections = async (req, res) => {
  const collectionId = req.params.collectionId;

  if (typeof collectionId == "undefined") {
    const userId = getUserIdByToken(req.headers);
    if (!userId) {
      res.status(403).json({
        success: false,
        message: "Please input valid jwt token in request header",
      });
      return;
    }
    await Collection.find({})
      .populate("user")
      .populate("event")
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    await Collection.findOne({ _id: collectionId })
      .populate("user")
      .populate("event")
      .exec()
      .then((results) => {
        res.status(results == null ? 404 : 200).json(results);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

const createCollection = async (req, res, next) => {
  const userId = getUserIdByToken(req.headers);
  if (!userId) {
    res.status(403).json({
      success: false,
      message: "Please input valid jwt token in request header",
    });
    return;
  }

  const eventId = req.params.eventId;

  // const { counts } = req.body;
  // const { plastic, tobacco, metal, glass, fabric, paper } = counts;

  try {
    const collection = new Collection({
      user: userId,
      event: eventId,
      // counts: {
      //   plastic,
      //   tobacco,
      //   metal,
      //   glass,
      //   fabric,
      //   paper,
      // },
    });

    const savedCollection = await collection.save();

    res.status(201).json({
      success: true,
      savedCollection,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
    return next(error);
  }
};

const updateCollection = async (req, res) => {
  const { counts } = req.body;
  const { plastic, tobacco, metal, glass, fabric, paper } = counts;
  const id = req.params.collectionId;

  let collection;
  try {
    collection = await Collection.findById(id);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not access collection by given id",
    });
    return;
  }
  if (!collection) {
    res.status(404).json({
      success: false,
      message: "Collection not found",
    });
    return;
  }

  collection.counts.plastic = plastic ?? collection.counts.plastic;
  collection.counts.tobacco = tobacco ?? collection.counts.tobacco;
  collection.counts.metal = metal ?? collection.counts.metal;
  collection.counts.glass = glass ?? collection.counts.glass;
  collection.counts.fabric = fabric ?? collection.counts.fabric;
  collection.counts.paper = paper ?? collection.counts.paper;

  try {
    await collection.save();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not save collection",
    });
    return;
  }

  res.status(200).json({ collection: collection.toObject({ getters: true }) });
};

const countUpCollection = async (req, res) => {};

module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  countUpCollection,
};
