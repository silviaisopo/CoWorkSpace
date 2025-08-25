const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotta di registrazione
router.post('/register', authController.register);

// Rotta di login
router.post('/login', authController.login);

module.exports = router;

