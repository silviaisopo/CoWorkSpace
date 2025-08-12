const Booking = require('../models/booking');
const User = require('../models/user');
const Workspace = require('../models/workspace');
const Location = require('../models/location');

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
          attributes: ['id', 'name', 'email'] // Specifica gli attributi per sicurezza
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

module.exports = {
  getManagerData
};
