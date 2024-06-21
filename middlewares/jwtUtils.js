require("dotenv").config();
const jwt = require("jsonwebtoken");

const getUserIdByToken = (reqHeaders) => {
  let userId;
  try {
    const token = reqHeaders["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    console.log(error);
  }
  return userId;
};

module.exports = getUserIdByToken;
