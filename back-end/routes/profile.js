const express = require('express');
const auth    = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

// Protect all profile routes
router.get('/me', auth, getProfile);
router.put('/',  auth, updateProfile);

module.exports = router;
