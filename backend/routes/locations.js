const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController"); // correggi il nome
const multer = require("multer");
const path = require("path");
const { authenticate, isManager } = require("../middleware/authMiddleware");
const Location = require("../models/location"); // <-- IMPORT FONDAMENTALE

// Configurazione multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ROTTA POST -> Creazione sede (solo manager)
router.post("/", authenticate, isManager, upload.single("image"), locationController.createLocation);

// ROTTA GET -> Tutte le sedi (solo manager)
router.get("/", authenticate, isManager, locationController.getLocations);

// ROTTA DELETE -> Elimina sede per ID (solo manager)
router.delete("/:id", authenticate, isManager, locationController.deleteLocation);

// ROTTA GET PUBBLICA -> Tutte le sedi visibili agli utenti senza login
router.get("/public", async (req, res) => {
    try {
        const locations = await Location.findAll(); // ora Location è definito
        res.json(locations);
    } catch (err) {
        console.error("Errore get /public:", err);
        res.status(500).json({ success: false, message: "Errore server" });
    }
});
// GET /api/locations/manager -> solo manager vede le proprie sedi
router.get('/manager', authenticate, isManager, locationController.getManagerLocations);

module.exports = router;


