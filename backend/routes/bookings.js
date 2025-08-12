const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');

// Debug: verifica gli import
console.log('Tipo di createBooking:', typeof bookingController.createBooking);
console.log('Tipo di authenticate:', typeof authenticate);

router.post('/',
    authenticate,
    bookingController.createBooking
);

router.get('/mybookings',
    authenticate,
    bookingController.getMyBookings
);

module.exports = router;