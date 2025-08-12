const { Sequelize } = require('sequelize'); // Aggiungi questa linea all'inizio
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'CoWorkSpace',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'Silvia24',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Log ridotto
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

// Test di connessione semplificato
sequelize.authenticate()
    .then(() => console.log('✅ Connesso al database'))
    .catch(err => console.error('❌ Errore connessione:', err.message));

module.exports = sequelize;