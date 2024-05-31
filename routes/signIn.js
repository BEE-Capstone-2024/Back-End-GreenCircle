const express = require("express");
const {
    getUser
} = require("../controllers/signInController");


const router = express.Router();

// GET: /api/signin/
router.get("/", getUser);

module.exports = router;