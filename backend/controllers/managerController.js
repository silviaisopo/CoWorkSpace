// controller per gestire le richieste dei manager
const Booking = require('../models/booking');
const User = require('../models/user');
const Workspace = require('../models/workspace');
const Location = require('../models/location');

// GET /api/manager/bookings
const getManagerData = async (req, res) => {
  const manager_id = req.user.id;

  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Workspace,
          include: [
            {
              model: Location,
              where: { manager_id }
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error('Errore getManagerData:', err);
    res.status(500).json({
      success: false,
      error: 'Errore del server'
    });
  }
};

// 🔑 esporta la funzione correttamente
module.exports = { getManagerData };

