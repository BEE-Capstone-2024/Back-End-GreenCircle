require('dotenv').config();
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const updateUser = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    if (!token) {
      return res.status(401).json({
        auth: false,
        message: "No token provided."
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).json({
          auth: false,
          message: "Failed to authenticate token."
        })
      }
    })

    let updatedUser = await User.findById(id);

    if (req.body.password) {
      req.body.password = await updatedUser.encryptPassword(req.body.password);
    }

    updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      updatedUser,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User has been deleted.",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = {
  updateUser,
  deleteUser,
};