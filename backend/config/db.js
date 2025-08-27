const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DB_URI || "npmpostgres://postgres:1234567890@localhost:5432/Progetto_Web";

const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,       // disabilita log SQL in console
    define: {
        timestamps: true,  // aggiunge automaticamente createdAt/updatedAt
        underscored: true, // snake_case per colonne
    },
});

// Connessione e sincronizzazione DB
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connesso al database");

        await sequelize.sync({ alter: true }); // sincronizza i modelli
        console.log("🔄 Database sincronizzato");
    } catch (err) {
        console.error("❌ Errore connessione DB:", err.message);
        process.exit(1); // termina il server se il DB non risponde
    }
}

module.exports = { sequelize, connectDB };

