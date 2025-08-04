const pool = require('../config/db');

// @desc    Get all bookings for all locations managed by the logged-in manager
// @route   GET /api/manager/bookings
// @access  Private, Manager only
exports.getManagerBookings = async (req, res) => {
  const manager_id = req.user.id;

  try {
    // We need to find all bookings for workspaces in locations managed by this manager.
    const query = `
      SELECT b.*, u.name as user_name, u.email as user_email, w.type as workspace_type, l.name as location_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN workspaces w ON b.workspace_id = w.id
      JOIN locations l ON w.location_id = l.id
      WHERE l.manager_id = $1
      ORDER BY b.start_time DESC
    `;

    const bookings = await pool.query(query, [manager_id]);

    res.json(bookings.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
