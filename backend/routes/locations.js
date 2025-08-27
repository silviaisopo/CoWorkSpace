// routes/locations.js
const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.post("/", locationController.createLocation);
router.get("/", locationController.getLocations);
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
