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
    await Collection.find({ user: userId })
      .populate("event")
      .exec()
      .then((results) => {
        if (!results || results.length === 0) {
          res.status(404).json({
            success: false,
            message: "No collections found for this user.",
          });
        } else {
          results.sort(
            (a, b) =>
              new Date(a.event.dateOfEvent) - new Date(b.event.dateOfEvent)
          );

          let materialSums = {};
          let totalMaterialCount = 0;
          let totalEventCount = results.length;
          let eventDatesWithSequence = [];
          let eventCounter = 0;

          const collections = results.map((result) => {
            const collection = result.toJSON({ virtuals: true });

            eventCounter += 1;
            eventDatesWithSequence.push({
              dateOfEvent: collection.event.dateOfEvent,
              sequence: eventCounter,
            });

            collection.counts.forEach((count) => {
              if (!materialSums[count.material]) {
                materialSums[count.material] = 0;
              }
              materialSums[count.material] += count.count;
              totalMaterialCount += count.count;
            });

            return collection;
          });

          res.status(200).json({
            success: true,
            collections: collections,
            materialSums: materialSums,
            totalMaterialCount: totalMaterialCount,
            totalEventCount: totalEventCount,
            eventDatesWithSequence: eventDatesWithSequence,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: err.message,
        });
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
    // Check if a collection already exists for this event and user
    const existingCollection = await Collection.findOne({
      user: userId,
      event: eventId,
    });

    if (existingCollection) {
      // If collection exists, return it
      res.status(200).json({
        success: true,
        savedCollection: existingCollection,
      });
      return;
    }

    // If collection does not exist, create a new one
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

const getCollectionsById = async (req, res) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await Collection.findById(collectionId)
      .populate("user")
      .populate("event")
      .exec();

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json(collection.toJSON({ virtuals: true }));
  } catch (err) {
    console.error("Error fetching collection:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCollectionStatus = async (req, res) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    const isCompleted = collection.completed;
    res.status(200).json(isCompleted);
  } catch (err) {
    console.error(`Error fetching collection status ${collectionId}:`, err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};


// Update collection status
const updateCollectionStatus = async (req, res) => {
  const { collectionId } = req.params;
  const { completed } = req.body;

  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { completed },
      { new: true }
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error(`Error updating collection status: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  getCollectionsById,
  getCollectionStatus,
  updateCollectionStatus,
};
