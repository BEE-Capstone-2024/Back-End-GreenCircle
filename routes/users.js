const express = require("express");
const {
  updateUser,
  deleteUser,
} = require("../controllers/userController");


const router = express.Router();

// PUT: /api/user/
router.put("/", updateUser);

// DELETE: /api/user/id
router.delete("/:id", deleteUser);

module.exports = router;