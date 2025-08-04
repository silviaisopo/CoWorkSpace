const pool = require('../config/db');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  const { workspace_id, start_time, end_time } = req.body;
  const user_id = req.user.id; // from auth middleware

  try {
    // Fetch workspace details to calculate price
    const workspaceResult = await pool.query('SELECT price_per_hour FROM workspaces WHERE id = $1', [workspace_id]);
    if (workspaceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Workspace not found' });
    }
    const price_per_hour = parseFloat(workspaceResult.rows[0].price_per_hour);

    // Calculate duration and total price
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const total_price = durationHours * price_per_hour;

    // Insert booking into database
    const newBooking = await pool.query(
      'INSERT INTO bookings (user_id, workspace_id, start_time, end_time, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, workspace_id, start_time, end_time, total_price, 'confirmed'] // Defaulting to 'confirmed' for simplicity
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await pool.query(
      'SELECT b.*, w.type, l.name as location_name FROM bookings b JOIN workspaces w ON b.workspace_id = w.id JOIN locations l ON w.location_id = l.id WHERE b.user_id = $1 ORDER BY b.start_time DESC',
      [req.user.id]
    );
    res.json(bookings.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
