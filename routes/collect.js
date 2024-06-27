const express = require('express');
const {
    createCollect,
}= require('../controllers/collectController');

const router = express.Router();

//POST: /api/collect/:eventId
router.post("/:eventId", createCollect)

module.exports = router;