// User routes
const express = require('express');
const router = express.Router();
const { getUserProfile, deleteMyAccount} = require('../controllers/userController');
const { authenticate, isUser } = require('../middleware/authMiddleware');

// GET /api/user/profile - Solo per utenti autenticati (come il manager)
router.get('/profile', authenticate, isUser, getUserProfile);
router.delete('/me', authenticate, deleteMyAccount);

module.exports = router;

