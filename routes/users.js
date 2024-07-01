const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser
} = require("../controllers/userController");


const router = express.Router();

// PUT: /api/user/
router.put("/", updateUser);

// DELETE: /api/user/id
router.delete("/:id", deleteUser);

//GET: /api/user
router.get("/info", getUser);

module.exports = router;