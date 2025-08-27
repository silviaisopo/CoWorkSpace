// controllers/userController.js
exports.getUserProfile = async (req, res) => {
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
