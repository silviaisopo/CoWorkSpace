//locationController.js
/*const { Op } = require('sequelize');
const Location = require('../models/location');


exports.createLocation = async (req, res) => {
  const { name, address, city, description, type, capacity, service, price_per_hour, manager_id } = req.body;
  try {
    const newLocation = await Location.create({
      name,
      address,
      city,
      description,
      type,
      capacity,
      service,
      price_per_hour,
      manager_id
    });
    res.status(201).json(newLocation);
  } catch (err) {
    console.error('Errore createLocation:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

exports.getLocations = async (req, res) => {
  const { city } = req.query;
  try {
    const whereClause = city ? { city: { [Op.iLike]: `%${city}%` } } : {};
    const locations = await Location.findAll({ where: whereClause });
    res.status(200).json(locations);
  } catch (err) {
    console.error('Errore getLocations:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location non trovata' });
    }
    res.status(200).json(location);
  } catch (err) {
    console.error('Errore getLocationById:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};*/
// controllers/locationsController.js

const Location = require('../models/location');

exports.createLocation = async (req, res) => {
  try {
    const { name, address, city, description, capacity, price_per_hour, type, services, manager_id } = req.body;

    if (!name || !address || !city || !capacity || !price_per_hour || !type) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }

    const location = await Location.create({
      name,
      address,
      city,
      description: description || null,
      capacity,
      price_per_hour,
      type,
      service: services || null,
      manager_id: manager_id || null
    });

    res.status(201).json({ message: "Sede creata con successo", id: location.id });
  } catch (err) {
    console.error("Errore creazione sede:", err);
    res.status(500).json({ error: "Errore del server" });
  }
};


// OTTIENI TUTTE LE SEDI
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (err) {
    console.error("Errore getLocations:", err);
    res.status(500).json({ error: "Errore del server" });
  }
};

// OTTIENI SEDE PER ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Sede non trovata" });
    res.status(200).json(location);
  } catch (err) {
    console.error("Errore getLocationById:", err);
    res.status(500).json({ error: "Errore del server" });
  }
};

// ELIMINA SEDE
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ error: "Sede non trovata" });

    await location.destroy();
    res.json({ message: "Sede eliminata con successo" });
  } catch (err) {
    console.error("Errore deleteLocation:", err);
    res.status(500).json({ error: "Errore del server" });
  }
};

