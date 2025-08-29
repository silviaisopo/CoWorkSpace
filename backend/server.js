// server.js
const express = require("express");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./config/db");

const Booking = require("./models/booking");
const Location = require("./models/location");
const User = require("./models/user");
const Payment = require("./models/payment");

// Inizializza le associazioni
require("./models/associazioni")();

// Rotte
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const managerRoutes = require("./routes/manager");
const bookingRoutes = require("./routes/bookings");
const locationRoutes = require("./routes/locations");
const paymentRoutes = require('./routes/payments');


const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 STATIC FILES
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    }
}));

// 🔹 Normalizzazione URL (evita doppie barre)
app.use((req, res, next) => {
    req.url = req.url.replace(/\/\/+/g, '/');
    next();
});
// Rende pubblica la cartella uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 ROTTE API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/locations", locationRoutes);
app.use('/api/payments', paymentRoutes);

// 🔹 HEALTH CHECK
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// 🔹 ROTTE HTML
["/login", "/registrazione", "/area_riservata", "/dashboard-manager"].forEach(route => {
    app.get(route, (req, res) => res.sendFile(path.join(publicPath, `${route}.html`)));
});

// 🔹 FALLBACK SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 🔹 ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message || "Errore server" });
});

// 🔹 AVVIO SERVER DOPO CONNESSIONE DB
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Server avviato su http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error("Errore connessione DB:", err);
        process.exit(1);
    });
