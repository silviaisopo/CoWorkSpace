const express = require('express');
const router = express.Router();
const { getManagerData } = require('../controllers/managerController');
const { authenticate, isManager } = require('../middleware/authMiddleware');

// Debug degli import
console.log('Tipo di getManagerData:', typeof getManagerData); // dovrebbe restituire "function"
console.log('Tipo di authenticate:', typeof authenticate); // dovrebbe restituire "function"
console.log('Tipo di isManager:', typeof isManager); // dovrebbe restituire "function"

// Route per i dati del manager
router.get('/bookings',
    authenticate,
    isManager,
    getManagerData
);

// Aggiungi altre route del manager qui...

module.exports = router;
