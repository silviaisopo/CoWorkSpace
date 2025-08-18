// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Cripta la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea l'utente
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Genera JWT
    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'supersegreto123',
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.status(201).json({
      message: 'Registrazione avvenuta con successo',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trova utente
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }

    // Genera JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'supersegreto123',
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.json({
      message: 'Login avvenuto con successo',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
};


