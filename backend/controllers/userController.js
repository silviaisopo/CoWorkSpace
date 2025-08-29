const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");

const getUserProfile = async (req, res) => {
    try {
        // Verifica opzionale del ruolo (se vuoi restringere solo a 'user')
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Accesso consentito solo agli utenti'
            });
        }

        // L'utente è già stato recuperato dal middleware authenticate
        const user = req.user;

        res.json({ success: true, user });
    } catch (err) {
        console.error('Errore getUserProfile:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteMyAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Recupera tutte le prenotazioni dell'utente
        const bookings = await Booking.findAll({ where: { user_id: userId } });

        // Elimina tutte le prenotazioni (i pagamenti associati saranno rimossi automaticamente grazie a CASCADE)
        for (const booking of bookings) {
            await booking.destroy();
        }

        // Elimina l'utente
        await User.destroy({ where: { id: userId } });

        res.json({ message: "Account eliminato con successo" });
    } catch (err) {
        console.error("Errore eliminazione account:", err);
        res.status(500).json({ error: "Errore del server durante l'eliminazione dell'account" });
    }
};

module.exports = { deleteMyAccount,
    getUserProfile };