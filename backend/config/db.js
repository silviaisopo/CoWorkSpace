// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "CoWorkSpace",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "Silvia24",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: false, // meno log in console
        define: {
            timestamps: true,
            underscored: true,
        },
    }
);

// Connessione + sincronizzazione
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connesso al database");

        // Sincronizza i modelli con il DB
        await sequelize.sync({ alter: true });
        console.log("🔄 Database sincronizzato");
    } catch (err) {
        console.error("❌ Errore connessione DB:", err.message);
        process.exit(1); // termina il server se il DB non risponde
    }
}

module.exports = { sequelize, connectDB };
