// bookingController.js
const { Op } = require('sequelize');
const Booking = require('../models/booking');
const Location = require('../models/location');
const Payment = require('../models/payment');

// FUNZIONE INTERNA PER CONTROLLO DISPONIBILITÀ
const checkAvailabilityInternal = async (location_id, startTime, endTime) => {
  try {
    const overlappingBooking = await Booking.findOne({
      where: {
        location_id,
        [Op.or]: [
          {
            start_time: { [Op.lt]: endTime },
            end_time: { [Op.gt]: startTime }
          }
        ]
      }
    });
    return !overlappingBooking;
  } catch (error) {
    console.error('Errore controllo disponibilità interno:', error);
    return false;
  }
};

// CREA PRENOTAZIONE
const createBooking = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ error: 'Dati mancanti nella richiesta' });

    const { location_id, start_time, end_time } = req.body;
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const location = await Location.findByPk(location_id);
    if (!location) return res.status(404).json({ error: 'Location non trovata' });

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: 'Formato data non valido' });
    }
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

    const isAvailable = await checkAvailabilityInternal(location_id, startTime, endTime);
    if (!isAvailable) return res.status(409).json({ error: 'Slot orario non disponibile' });

    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const total_price = durationHours * parseFloat(location.price_per_hour);

    const booking = await Booking.create({
      user_id: req.user.id,
      location_id,
      start_time: startTime,
      end_time: endTime,
      total_price,
      status: 'confirmed'
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    res.status(500).json({ error: 'Errore del server durante la creazione della prenotazione' });
  }
};

// CONTROLLO DISPONIBILITÀ API
const checkAvailability = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ error: 'Dati mancanti nella richiesta' });

    const { location_id, start_time, end_time } = req.body;
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: 'Formato data non valido' });
    }
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

    const isAvailable = await checkAvailabilityInternal(location_id, startTime, endTime);

    res.json({
      available: isAvailable,
      message: isAvailable ? 'Slot disponibile' : 'Slot già prenotato'
    });

  } catch (error) {
    console.error('Errore controllo disponibilità:', error);
    res.status(500).json({ error: 'Errore del server durante il controllo disponibilità' });
  }
};

// GET PRENOTAZIONI PER LOCATION
const getBookingsByLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    if (!location_id) return res.status(400).json({ error: 'ID location mancante' });

    const bookings = await Booking.findAll({
      where: { location_id },
      order: [['start_time', 'ASC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Errore recupero prenotazioni location:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
};


// GET PRENOTAZIONI UTENTE
const getMyBookings = async (req, res) => {
  try {
    // Recupera solo le prenotazioni dell'utente loggato
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Location, // Sequelize conosce l'associazione
          attributes: ['id', 'name', 'address', 'city', 'image_url']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json(bookings);

  } catch (error) {
    console.error('Errore recupero prenotazioni:', error);
    res.status(500).json({ error: 'Errore del server durante il recupero delle prenotazioni' });
  }
};

// DELETE PRENOTAZIONE
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: Payment, // includiamo il pagamento associato
    });

    if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });

    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accesso negato: non puoi cancellare questa prenotazione' });
    }

    // elimina il pagamento collegato, se esiste
    if (booking.Payment) {
      await booking.Payment.destroy();
    }

    // elimina la prenotazione
    await booking.destroy();

    res.json({ message: 'Prenotazione cancellata con successo' });

  } catch (err) {
    console.error('Errore cancellazione prenotazione:', err);
    res.status(500).json({ error: 'Errore del server durante la cancellazione della prenotazione' });
  }
};


const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id, { include: Location });
    if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });

    // Verifica che chi aggiorna sia manager della location
    if (!booking.Location || booking.Location.manager_id !== req.user.id) {
      return res.status(403).json({ error: 'Accesso negato: non puoi modificare questa prenotazione' });
    }

    if (!status) return res.status(400).json({ error: 'Stato mancante' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'Prenotazione aggiornata', booking });
  } catch (error) {
    console.error('Errore updateBooking:', error);
    res.status(500).json({ error: 'Errore del server durante l\'aggiornamento della prenotazione' });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Location,
          attributes: ['id', 'name', 'address', 'city', 'manager_id']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Errore getAllBookings:', error);
    res.status(500).json({ error: 'Errore del server durante il recupero delle prenotazioni' });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getBookingsByLocation,
  getMyBookings,
  deleteBooking,
    updateBooking,
    getAllBookings
};
