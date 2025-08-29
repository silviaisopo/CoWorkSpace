const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController"); // nome corretto
const multer = require("multer");
const path = require("path");
const { authenticate, isManager } = require("../middleware/authMiddleware");
const Location = require("../models/location");

// Configurazione multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ROTTA POST -> Creazione sede (solo manager)
router.post("/", authenticate, isManager, upload.single("image"), locationController.createLocation);

// ROTTA GET -> Sedi di un manager (autenticato)
router.get("/manager", authenticate, isManager, locationController.getManagerLocations);

// ROTTA GET PUBBLICA -> Tutte le sedi visibili agli utenti senza login
router.get("/public", async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.json(locations);
    } catch (err) {
        console.error("Errore get /public:", err);
        res.status(500).json({ success: false, message: "Errore server" });
    }
});

// ROTTA GET -> Tutte le sedi (solo manager)
router.get("/", authenticate, isManager, locationController.getLocations);

// ROTTA GET -> Info singola sede (id numerico)
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID non valido" });
        }
        const location = await Location.findByPk(id);
        if (!location) return res.status(404).json({ error: "Sede non trovata" });
        res.json(location);
    } catch (err) {
        console.error("Errore get /:id:", err);
        res.status(500).json({ error: "Errore del server" });
    }
});

// ROTTA DELETE -> Elimina sede per ID (solo manager)
router.delete("/:id", authenticate, isManager, locationController.deleteLocation);

module.exports = router;


