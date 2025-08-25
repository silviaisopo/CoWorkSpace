const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isUser } = require('../middleware/authMiddleware');

// CREA PRENOTAZIONE
router.post('/', authenticate, isUser, bookingController.createBooking);

// GET PRENOTAZIONI UTENTE
router.get('/mybookings', authenticate, isUser, bookingController.getMyBookings);

// DELETE PRENOTAZIONE
router.delete('/:id', authenticate, isUser, bookingController.deleteBooking);

module.exports = router;
