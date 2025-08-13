// public/js/app.js - Script principale sicuro e modulare

document.addEventListener('DOMContentLoaded', () => {
    console.log(`[app.js] Avvio script sulla pagina: ${window.location.pathname}`);

    // --- ELEMENTI UI ---
    const loader = document.getElementById('loader') || null;
    const content = document.getElementById('content') || null;
    const errorBox = document.getElementById('error-message') || null;

    // --- FUNZIONI UI ---
    const showLoader = () => {
        if (loader) loader.style.display = 'block';
        if (content) content.style.display = 'none';
    };

    const hideLoader = () => {
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    };

    const showError = (message) => {
        if (!errorBox) return;
        errorBox.textContent = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 5000);
    };

    // --- FUNZIONE GENERICA PER CHIAMATE API ---
    const fetchData = async (endpoint, options = {}) => {
        try {
            showLoader();
            const response = await fetch(`/api/${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
            // Aggiorna la UI qui
        } catch (error) {
            // Errore già gestito da fetchData
        }
    };

    // --- INIZIALIZZAZIONE IN BASE ALLA PAGINA ---
    if (document.getElementById('booking-section')) {
        console.log('[app.js] Avvio logica pagina prenotazioni...');
        loadBookings();
    }

    if (document.getElementById('home-section')) {
        console.log('[app.js] Avvio logica pagina home...');
        // Qui codice per la home
    }

    if (document.getElementById('contact-section')) {
        console.log('[app.js] Avvio logica pagina contatti...');
        // Qui codice per la pagina contatti
    }

    // --- GESTIONE ERRORI GLOBALI ---
    window.addEventListener('error', (e) => {
        console.error('[Errore Globale]', e.message);
        showError(`Errore: ${e.message}`);
    });
});
