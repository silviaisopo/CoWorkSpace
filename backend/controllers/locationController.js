const pool = require('../config/db');

// @desc    Get all locations, with optional filtering by city
// @route   GET /api/locations
exports.getLocations = async (req, res) => {
  const { city } = req.query;
  try {
    let query = 'SELECT * FROM locations';
    const queryParams = [];
    if (city) {
      query += ' WHERE city ILIKE $1';
      queryParams.push(`%${city}%`);
    }
    const locations = await pool.query(query, queryParams);
    res.json(locations.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single location by ID
// @route   GET /api/locations/:id
exports.getLocationById = async (req, res) => {
  try {
    const location = await pool.query('SELECT * FROM locations WHERE id = $1', [req.params.id]);
    if (location.rows.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all workspaces for a specific location
// @route   GET /api/locations/:id/workspaces
exports.getWorkspacesByLocation = async (req, res) => {
  try {
    const workspaces = await pool.query('SELECT * FROM workspaces WHERE location_id = $1', [req.params.id]);
    res.json(workspaces.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
