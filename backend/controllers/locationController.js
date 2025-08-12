const Location = require('../models/location');
const Workspace = require('../models/workspace');

exports.getLocations = async (req, res) => {
  const { city } = req.query;
  try {
    const whereClause = city ? { city: { [require('sequelize').Op.iLike]: `%${city}%` } } : {};
    const locations = await Location.findAll({ where: whereClause });
    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getWorkspacesByLocation = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({ where: { location_id: req.params.id } });
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
