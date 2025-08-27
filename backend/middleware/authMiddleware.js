// Middleware per autenticazione e autorizzazione basata su ruoli
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware per verificare il token JWT
const authenticate = async (req, res, next) => {
  let token;

  // Cerco token nell'header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.header('x-auth-token')) {
    // fallback su x-auth-token se usi ancora quello
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accesso negato, nessun token fornito' });
  }

  try {
    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersegreto123');

    // Recupera utente dal DB (così sei sicuro che esista ancora)
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Errore authenticate middleware:', error);
    res.status(400).json({ success: false, message: 'Token non valido o scaduto' });
  }
};

// Middleware per verificare il ruolo "user"
const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accesso negato: ruolo user richiesto' });
  }
};

// Middleware per verificare il ruolo "manager"
const isManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accesso negato: ruolo manager richiesto' });
  }
};

module.exports = {
  authenticate,
  isManager,
  isUser
};