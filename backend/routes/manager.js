const express = require('express');
const router = express.Router();
const { authenticate, isManager } = require('../middleware/authMiddleware');
const { deleteManagerAccount } = require("../controllers/managerController");

// Profilo del manager loggato
router.get('/profile', authenticate, isManager, async (req, res) => {
    try {
        // `req.user` è già settato dal middleware
        res.json({
            success: true,
            manager: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Errore server" });
    }
});
router.delete("/me", authenticate, deleteManagerAccount);
module.exports = router;
