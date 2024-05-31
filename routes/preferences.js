const express = require('express');
const {
    createPreferences,
    getPreferences,
    updatePreferences,
}= require('../controllers/preferencesController');

const router = express.Router();

//POST: /api/preferences/
router.post("/", createPreferences)

// GET: /api/preferences/
router.get("/", getPreferences);

// PUT: /api/preferences/
router.put("/", updatePreferences);

module.exports = router;