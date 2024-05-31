const express = require("express");
const {
  createUser
} = require("../controllers/signUpController");


const router = express.Router();

// POST: /api/signup/
router.post("/", createUser);

module.exports = router;