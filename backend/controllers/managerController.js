// controller per gestire le richieste dei manager
const Booking = require('../models/booking');
const User = require('../models/user');
const Location = require('../models/location');
const Payment = require('../models/payment');

// GET /api/manager/bookings
const getManagerData = async (req, res) => {
  const manager_id = req.user.id;

  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Location,
          where: { manager_id },
          attributes: ['id', 'name', 'city', 'type']
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

async function deleteManagerAccount(req, res) {
  try {
    const managerId = req.user.id;

    // Recupera tutte le sedi del manager
    const locations = await Location.findAll({ where: { manager_id: managerId } });

    // Se ci sono ancora sedi, blocca l'eliminazione e invia messaggio specifico
    if (locations.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossibile eliminare l'account manager: ci sono ancora sedi associate."
      });
    }

    // Se non ci sono sedi, elimina l'account manager
    await User.destroy({ where: { id: managerId } });

    return res.json({ success: true, message: "Account manager eliminato con successo." });
  } catch (err) {
    console.error("Errore eliminazione account manager:", err);
    return res.status(500).json({ success: false, message: "Errore eliminazione account" });
  }
}


// 🔑 esporta la funzione
module.exports = { getManagerData,deleteManagerAccount };
