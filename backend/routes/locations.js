const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// @route   GET api/locations
// @desc    Get all locations
// @access  Public
router.get('/', locationController.getLocations);

// @route   GET api/locations/:id
// @desc    Get a single location by ID
// @access  Public
router.get('/:id', locationController.getLocationById);

// @route   GET api/locations/:id/workspaces
// @desc    Get all workspaces for a location
// @access  Public
router.get('/:id/workspaces', locationController.getWorkspacesByLocation);

module.exports = router;
