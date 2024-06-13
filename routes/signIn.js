const express = require("express");
const {
    getUser
} = require("../controllers/signInController");


const router = express.Router();

//POST: /api/signin/
router.post("/", getUser);

module.exports = router;