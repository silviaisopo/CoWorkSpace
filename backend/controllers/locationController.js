const { Op } = require('sequelize');
const Location = require('../models/location');
const Workspace = require('../models/workspace');

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
};

exports.getWorkspacesByLocation = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({
      where: { location_id: req.params.id },
    });
    res.status(200).json(workspaces);
  } catch (err) {
    console.error('Errore getWorkspacesByLocation:', err);
    res.status(500).json({ message: 'Errore server' });
  }
};
