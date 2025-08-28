/*const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isUser } = require('../middleware/authMiddleware');

// CREA PRENOTAZIONE
router.post('/', authenticate, isUser, bookingController.createBooking);

// GET PRENOTAZIONI UTENTE
router.get('/mybookings', authenticate, isUser, bookingController.getMyBookings);

// DELETE PRENOTAZIONE
router.delete('/:id', authenticate, isUser, bookingController.deleteBooking);

router.post('/check-availability', bookingController.checkAvailability);

module.exports = router;*/
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isUser } = require('../middleware/authMiddleware');

// CREA PRENOTAZIONE
router.post('/', authenticate, isUser, bookingController.createBooking);

// CONTROLLO DISPONIBILITÀ
router.post('/check-availability', bookingController.checkAvailability);

// GET PRENOTAZIONI PER LOCATION - CORREGGI IL NOME DELLA FUNZIONE
router.get('/location/:location_id', bookingController.getBookingsByLocation);

// GET PRENOTAZIONI UTENTE
router.get('/mybookings', authenticate, isUser, bookingController.getMyBookings);

// DELETE PRENOTAZIONE
router.delete('/:id', authenticate, isUser, bookingController.deleteBooking);

module.exports = router;