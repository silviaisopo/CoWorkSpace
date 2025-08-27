const express = require('express');
const router = express.Router();
const { getManagerData } = require('../controllers/managerController');
const { authenticate, isManager } = require('../middleware/authMiddleware');

// Route per i dati del manager (solo manager)
router.get('/bookings', authenticate, isManager, getManagerData);

module.exports = router;
