// bookingController.js
/*const Booking = require('../models/booking');
const Location = require('../models/location');

// CREA PRENOTAZIONE
const createBooking = async (req, res) => {
  const { location_id, start_time, end_time } = req.body;

  try {
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const location = await Location.findByPk(location_id);
    if (!location) return res.status(404).json({ error: 'Location non trovata' });

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

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

// GET PRENOTAZIONI UTENTE
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [Location],
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
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });

    // Controllo: solo l'utente proprietario può cancellare
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accesso negato: non puoi cancellare questa prenotazione' });
    }

    await booking.destroy();
    res.json({ message: 'Prenotazione cancellata con successo' });

  } catch (err) {
    console.error('Errore cancellazione prenotazione:', err);
    res.status(500).json({ error: 'Errore del server durante la cancellazione della prenotazione' });
  }
};

const checkAvailability = async (req, res) => {
  const { location_id, start_time, end_time } = req.body;

  try {
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

    // Controlla se ci sono prenotazioni esistenti che si sovrappongono
    const existingBooking = await Booking.findOne({
      where: {
        location_id,
        [Op.or]: [
          {
            start_time: { [Op.between]: [startTime, endTime] }
          },
          {
            end_time: { [Op.between]: [startTime, endTime] }
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: startTime } },
              { end_time: { [Op.gte]: endTime } }
            ]
          }
        ]
      }
    });

    if (existingBooking) {
      return res.status(409).json({ available: false, error: 'Slot orario già prenotato' });
    }

    res.json({ available: true });

  } catch (error) {
    console.error('Errore controllo disponibilità:', error);
    res.status(500).json({ error: 'Errore del server durante il controllo disponibilità' });
  }
};

// Non dimenticare di esportare la nuova funzione
module.exports = {
  createBooking,
  getMyBookings,
  deleteBooking,
  checkAvailability
};*/

const { Op } = require('sequelize');
const Booking = require('../models/booking');
const Location = require('../models/location');

// CREA PRENOTAZIONE
const createBooking = async (req, res) => {
  try {
    // Verifica che req.body esista
    if (!req.body) {
      return res.status(400).json({ error: 'Dati mancanti nella richiesta' });
    }

    const { location_id, start_time, end_time } = req.body;

    // Validazione input
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ error: 'Location non trovata' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Validazione date
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: 'Formato data non valido' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

    // Verifica disponibilità
    const isAvailable = await checkAvailabilityInternal(location_id, startTime, endTime);
    if (!isAvailable) {
      return res.status(409).json({ error: 'Slot orario non disponibile' });
    }

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

// CONTROLLO DISPONIBILITÀ API
const checkAvailability = async (req, res) => {
  try {
    // Verifica che req.body esista
    if (!req.body) {
      return res.status(400).json({ error: 'Dati mancanti nella richiesta' });
    }

    const { location_id, start_time, end_time } = req.body;

    // Validazione input
    if (!location_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Validazione date
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: 'Formato data non valido' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'La data di fine deve essere successiva alla data di inizio' });
    }

    // Controlla sovrapposizioni
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

    if (!location_id) {
      return res.status(400).json({ error: 'ID location mancante' });
    }

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
/*const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [Location],
      order: [['start_time', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Errore recupero prenotazioni:', error);
    res.status(500).json({ error: 'Errore del server durante il recupero delle prenotazioni' });
  }
};*/
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Location,
        attributes: ['id', 'name', 'address', 'city', 'image_url']
      }],
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
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });

    // Controllo: solo l'utente proprietario può cancellare
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accesso negato: non puoi cancellare questa prenotazione' });
    }

    await booking.destroy();
    res.json({ message: 'Prenotazione cancellata con successo' });

  } catch (err) {
    console.error('Errore cancellazione prenotazione:', err);
    res.status(500).json({ error: 'Errore del server durante la cancellazione della prenotazione' });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getBookingsByLocation, // QUESTA ERA QUELLA MANCANTE!
  getMyBookings,
  deleteBooking
};