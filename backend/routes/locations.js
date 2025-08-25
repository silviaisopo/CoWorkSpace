const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET /api/locations
router.get('/', locationController.getLocations);

// GET /api/locations/:id
router.get('/:id', locationController.getLocationById);

// GET /api/locations/:id/workspaces
router.get('/:id/workspaces', locationController.getWorkspacesByLocation);

module.exports = router;

