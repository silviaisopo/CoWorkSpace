const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

/**
 * Flusso pagamento + creazione prenotazione
 */
const processPaymentAndBooking = async (req, res) => {
    const t = await Booking.sequelize.transaction();

    try {
        const { user_id, location_id, start_time, end_time, total_price, payment_method, card_number } = req.body.booking;

        // Controllo dati obbligatori
        if (!user_id || !location_id || !start_time || !end_time || !total_price || !card_number) {
            return res.status(400).json({ success: false, message: "Dati prenotazione o carta mancanti." });
        }

        // 🔹 Controllo formato carta: 4 blocchi da 4 cifre separati da spazi o senza
        const cardPattern = /^(\d{4}\s?){4}$/;
        if (!cardPattern.test(card_number)) {
            return res.status(400).json({ success: false, message: "Formato carta non valido." });
        }

        // Simulazione pagamento sempre completata se formato corretto
        const paymentStatus = "completed";

        // 2. Creazione prenotazione
        const booking = await Booking.create({
            user_id,
            location_id,
            start_time,
            end_time,
            total_price
        }, { transaction: t });

        // 3. Creazione pagamento associato
        const payment = await Payment.create({
            booking_id: booking.id,
            amount: total_price,
            payment_method: payment_method || "carta di credito",
            status: paymentStatus,
            transaction_id: uuidv4()
        }, { transaction: t });

        await t.commit();

        return res.status(201).json({ success: true, booking, payment });

    } catch (error) {
        console.error("Errore in processPaymentAndBooking:", error);
        await t.rollback();
        return res.status(500).json({ success: false, message: "Errore durante il processo di pagamento/prenotazione." });
    }
};

module.exports = {
    processPaymentAndBooking
};

