const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', authMiddleware, createBooking);

// @route   GET api/bookings/mybookings
// @desc    Get user's bookings
// @access  Private
router.get('/mybookings', authMiddleware, getMyBookings);

module.exports = router;
