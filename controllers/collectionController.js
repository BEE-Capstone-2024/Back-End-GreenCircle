const Collection = require("../models/Collection");
const getUserIdByToken = require("../middlewares/jwtUtils");
const materialTypes = require("../middlewares/materialTypes");

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
        res
          .status(results == null ? 404 : 200)
          .json(results.toJSON({ virtuals: true }));
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
        res
          .status(results == null ? 404 : 200)
          .json(results.toJSON({ virtuals: true }));
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

  try {
    const collection = new Collection({
      user: userId,
      event: eventId,
      counts: materialTypes.map((mtype) => {
        return { material: mtype };
      }),
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
  const id = req.params.collectionId;
  const materialType = req.params.materialType;
  const action = req.body.action; // Expect 'increment' or 'decrement' in the request body

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

  if (typeof materialType == "undefined") {
    // clear count of all materials
    collection.counts = materialTypes.map((mtype) => {
      return { material: mtype, count: 0 }; // Initialize count to 0
    });
  } else {
    // update count based on action
    collection.counts = collection.counts.map((element) => {
      if (element.material == materialType) {
        if (action === "increment") {
          element.count++;
        } else if (action === "decrement") {
          element.count = Math.max(0, element.count - 1); // Ensure count doesn't go below 0
        }
      }
      return element;
    });
  }

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


module.exports = {
  getCollections,
  createCollection,
  updateCollection,
};
