const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  getWorkspacesByLocation,
} = require('../controllers/locationController');

// @route   GET api/locations
// @desc    Get all locations
// @access  Public
router.get('/', getLocations);

// @route   GET api/locations/:id
// @desc    Get a single location by ID
// @access  Public
router.get('/:id', getLocationById);

// @route   GET api/locations/:id/workspaces
// @desc    Get all workspaces for a location
// @access  Public
router.get('/:id/workspaces', getWorkspacesByLocation);

module.exports = router;
