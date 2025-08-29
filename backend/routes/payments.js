// Description: Route per gestire i pagamenti
const express = require("express");
const router = express.Router();
const { processPaymentAndBooking } = require("../controllers/paymentController");

// POST pagamento + booking
router.post("/checkout", processPaymentAndBooking);

module.exports = router;


