/*configurazione database PostgreSQL con Sequelize
const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DB_URI || "npmpostgres://postgres:Silvia24@localhost:5432/CoWorkSpace";

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

*/
const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DB_URI || "postgres://postgres:Silvia24@localhost:5432/CoWorkSpace";

const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // permette cert non firmati da CA
        },
    },
});

// Connessione e sincronizzazione DB
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connesso al database");

        await sequelize.sync({ alter: true });
        console.log("🔄 Database sincronizzato");
    } catch (err) {
        console.error("❌ Errore connessione DB:", err.message);
        process.exit(1);
    }
}

module.exports = { sequelize, connectDB };
