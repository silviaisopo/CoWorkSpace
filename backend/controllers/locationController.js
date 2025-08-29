// controllers/locationsController.js
const Location = require('../models/location');

exports.createLocation = async (req, res) => {
  try {
    const { name, address, city, description, capacity, price_per_hour, type, services, manager_id } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}`.slice(0, 255) : null;

    const location = await Location.create({
      name,
      address,
      city,
      description: description || null,
      capacity,
      price_per_hour,
      type,
      services: services || null,
      manager_id: manager_id || null,
      image_url
    });

    res.status(201).json({ message: "Sede creata con successo", id: location.id });
  } catch (err) {
    console.error("Errore creazione sede:", err);
    res.status(500).json({ error: "Errore del server" });
  }
};

// OTTIENI TUTTE LE SEDI DI UN MANAGER
exports.getManagerLocations = async (req, res) => {
  try {
    const managerId = req.user.id; // recupera id dal token autenticato
    const locations = await Location.findAll({
      where: { manager_id: managerId }
    });
    res.status(200).json(locations);
  } catch (err) {
    console.error("Errore getManagerLocations:", err);
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

