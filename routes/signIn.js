const express = require("express");
const {
    getUser
} = require("../controllers/signInController");


const router = express.Router();

// GET: /api/signin/
// router.get("/", getUser);

//POST: /api/signin/
router.post("/", createUser);

module.exports = router;