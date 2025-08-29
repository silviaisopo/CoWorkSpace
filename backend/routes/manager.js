/*const express = require('express');
const router = express.Router();
const { getManagerData } = require('../controllers/managerController');
const { authenticate, isManager } = require('../middleware/authMiddleware');

// Route per i dati del manager (solo manager)
router.get('/bookings', authenticate, isManager, getManagerData);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { authenticate, isManager } = require('../middleware/authMiddleware');

// Profilo del manager loggato
router.get('/profile', authenticate, isManager, async (req, res) => {
    try {
        // `req.user` è già settato dal middleware
        res.json({
            success: true,
            manager: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Errore server" });
    }
});

module.exports = router;
