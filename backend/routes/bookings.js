//routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isUser, isManager } = require('../middleware/authMiddleware');

// CREA PRENOTAZIONE
router.post('/', authenticate, isUser, bookingController.createBooking);

// CONTROLLO DISPONIBILITÀ
router.post('/check-availability', bookingController.checkAvailability);

// GET PRENOTAZIONI PER LOCATION - CORREGGI IL NOME DELLA FUNZIONE
router.get('/location/:location_id', bookingController.getBookingsByLocation);

// GET PRENOTAZIONI UTENTE
router.get('/my-bookings', authenticate, isUser, bookingController.getMyBookings);

// DELETE PRENOTAZIONE
router.delete('/:id', authenticate, isUser, bookingController.deleteBooking);
router.patch('/:id', authenticate, isManager, bookingController.updateBooking);
router.get('/', authenticate, isManager, bookingController.getAllBookings);

module.exports = router;