const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/manager', require('./routes/manager'));

app.get('/', (req, res) => {
  res.send('Coworking booking platform backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
