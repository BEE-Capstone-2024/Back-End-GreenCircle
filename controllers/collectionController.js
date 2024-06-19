const Collection = require("../models/Collection");
const getUserIdByToken = require("../middlewares/jwtUtils");

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

  const { counts } = req.body;
  const { plastic, tobacco, metal, glass, fabric, paper } = counts;

  try {
    const collection = new Collection({
      user: userId,
      event: eventId,
      counts: {
        plastic,
        tobacco,
        metal,
        glass,
        fabric,
        paper,
      },
    });

    const savedCollection = await collection.save();

    res.status(200).json({
      success: true,
      savedCollection,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = {
  createCollection,
};
