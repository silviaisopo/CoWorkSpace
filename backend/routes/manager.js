const express = require('express');
const router = express.Router();
const { getManagerBookings } = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');
const managerMiddleware = require('../middleware/managerMiddleware');

// @route   GET api/manager/bookings
// @desc    Get all bookings for a manager's locations
// @access  Private, Manager
router.get('/bookings', [authMiddleware, managerMiddleware], getManagerBookings);

module.exports = router;
