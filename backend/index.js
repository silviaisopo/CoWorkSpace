/*console.clear(); // Pulisce la console all'avvio
console.log('🚀 Avvio server...');
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = require('./config/db');
const setupAssociations = require('./models/associazioni');

const app = express();
const PORT = process.env.PORT || 63342;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Importa tutti i modelli
require('./models/user');
require('./models/location');
require('./models/workspace');
require('./models/service');
require('./models/workspaceService');
require('./models/booking');
require('./models/payment');

// Configura le associazioni
setupAssociations();

// Rotte API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/manager', require('./routes/manager'));

// Rotta per la pagina iniziale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
});

// Gestione errori
app.use((err, req, res, next) => {
    console.error('Errore interno:', err.stack);
    res.status(500).json({ error: 'Errore interno del server' });
});

// Avvio del server dopo la sincronizzazione del DB
sequelize.sync({ force: process.env.FORCE_SYNC === 'true' })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server in ascolto su http://localhost:${PORT}`);
            console.log('Database sincronizzato e associazioni configurate!');
            if (process.env.NODE_ENV === 'development') {
                console.log(`API docs disponibili su http://localhost:${PORT}/api-docs`);
            }
        });

        process.on('SIGTERM', () => {
            console.log('Ricevuto SIGTERM, chiudo server...');
            const server = app.listen();
            server.close(() => {
                console.log('Server chiuso');
                process.exit(0);
            });
        });
    })
    .catch(err => {
        console.error('Errore sincronizzazione database:', err);
        process.exit(1);
    });*/

const express = require('express');
const path = require('path');
const app = express();
const PORT = 63342; // Usiamo la stessa porta

// Configurazione assoluta del percorso
const publicPath = path.join(__dirname, '..', 'public');
console.log(`Serving static files from: ${publicPath}`); // Debug del percorso

app.use(express.static(publicPath));

// Rotta di fallback per SPA (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server Node.js attivo su http://localhost:${PORT}`);
    console.log(`📄 Frontend: http://localhost:${PORT}/index.html`);
});
