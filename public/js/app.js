// public/js/app.js - Script principale sicuro e modulare

document.addEventListener('DOMContentLoaded', () => {
    console.log(`[app.js] Avvio script sulla pagina: ${window.location.pathname}`);

    // --- ELEMENTI UI ---
    const loader = document.getElementById('loader') || null;
    const content = document.getElementById('content') || null;
    const errorBox = document.getElementById('error-message') || null;
    const cors = require('cors');
    app.use(cors()); // Sopra app.use(express.json())
    const express = require('express');
    const path = require('path');

    const app = express();
    const publicPath = path.join(__dirname, 'public'); // Percorso assoluto

    app.use(express.static(publicPath)); // Serve file statici da /public

    // --- FUNZIONI UI ---
    const showLoader = () => {
        if (loader) loader.style.display = 'block';
        if (content) content.style.display = 'none';
    };

    const hideLoader = () => {
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    };

    let errorTimeout;
    const showError = (message) => {
        if (!errorBox) return;
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    };

    // --- FUNZIONE GENERICA PER CHIAMATE API ---
    const fetchData = async (endpoint, options = {}) => {
        try {
            showLoader();
            const response = await fetch(`/api/${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore API ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            showError(error.message);
            console.error('[API Error]', error);
            throw error;
        } finally {
            hideLoader();
        }
    };

    // --- FUNZIONI SPECIFICHE PER PAGINA ---
    const loadBookings = async () => {
        try {
            const data = await fetchData('bookings');
            console.log('Prenotazioni caricate:', data);
            // TODO: aggiorna la UI con i dati ricevuti
        } catch (error) {
            // L’errore è già gestito da fetchData
        }
    };

    // --- INIZIALIZZAZIONE IN BASE ALLA PAGINA ---
    if (document.getElementById('booking-section')) {
        console.log('[app.js] Avvio logica pagina prenotazioni...');
        loadBookings();
    }

    if (document.getElementById('home-section')) {
        console.log('[app.js] Avvio logica pagina home...');
        // TODO: logica per la home
    }

    if (document.getElementById('contact-section')) {
        console.log('[app.js] Avvio logica pagina contatti...');
        // TODO: logica per i contatti
    }

    // --- GESTIONE ERRORI GLOBALI ---
    window.addEventListener('error', (e) => {
        console.error('[Errore Globale]', e.message);
        showError(`Errore: ${e.message}`);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('[Promise Rejection]', e.reason);
        showError(`Errore: ${e.reason?.message || e.reason}`);
    });
});

