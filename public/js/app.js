// public/js/app.js - File base per iniziare

document.addEventListener('DOMContentLoaded', () => {
    // Elementi UI
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    const errorBox = document.getElementById('error-message');

    // Funzione per chiamate API
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
            console.error('API Error:', error);
            throw error;
        } finally {
            hideLoader();
        }
    };

    // Funzioni di utilità UI
    const showLoader = () => {
        if (loader) loader.style.display = 'block';
        if (content) content.style.display = 'none';
    };

    const hideLoader = () => {
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'block';
    };

    const showError = (message) => {
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.style.display = 'block';
            setTimeout(() => {
                errorBox.style.display = 'none';
            }, 5000);
        }
    };

    // Esempio: Caricamento prenotazioni
    const loadBookings = async () => {
        try {
            const data = await fetchData('bookings');
            console.log('Prenotazioni caricate:', data);
            // Qui puoi aggiornare la UI con i dati
        } catch (error) {
            // Gestione errore già gestita in fetchData
        }
    };

    // Inizializzazione
    if (document.getElementById('booking-section')) {
        loadBookings();
    }

    // Aggiungi qui altri gestori di eventi e funzioni specifiche
    // per le diverse sezioni della tua applicazione
});