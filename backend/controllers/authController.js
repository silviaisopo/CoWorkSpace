const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Controlla se esiste già
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Cripta la password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea utente
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Genera JWT
    const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trova utente
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Genera token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

