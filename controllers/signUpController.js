require('dotenv').config();
const User = require("../models/User");

const jwt =  require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      return next(new Error("name, photo, email & password fields are required"));
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      res.status(404);
      return next(new Error("User already exists"));
    }

    const user = new User({ name, email });
    user.password = await user.encryptPassword(password);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 *90
    });

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: userObject,
      token,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
}

module.exports = {
    createUser,
};