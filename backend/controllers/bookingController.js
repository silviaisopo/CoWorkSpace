const Booking = require('../models/booking');
const Workspace = require('../models/workspace');
const Location = require('../models/location');

const createBooking = async (req, res) => {
  const { workspace_id, start_time, end_time } = req.body;

  try {
    // Validazione input
    if (!workspace_id || !start_time || !end_time) {
      return res.status(400).json({
        error: 'Tutti i campi sono obbligatori'
      });
    }

    const workspace = await Workspace.findByPk(workspace_id);
    if (!workspace) {
      return res.status(404).json({
        error: 'Workspace non trovato'
      });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      return res.status(400).json({
        error: 'La data di fine deve essere successiva alla data di inizio'
      });
    }

    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const total_price = durationHours * parseFloat(workspace.price_per_hour);

    const booking = await Booking.create({
      user_id: req.user.id,
      workspace_id,
      start_time: startTime,
      end_time: endTime,
      total_price,
      status: 'confirmed'
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    res.status(500).json({
      error: 'Errore del server durante la creazione della prenotazione'
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Workspace,
          include: [Location]
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Errore recupero prenotazioni:', error);
    res.status(500).json({
      error: 'Errore del server durante il recupero delle prenotazioni'
    });
  }
};

// Esportazione corretta
module.exports = {
  createBooking,
  getMyBookings
};