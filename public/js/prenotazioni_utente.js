//prenotazioni_utente.js
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    populateUserProfile();
    loadBookings();

    const tabActive = document.getElementById('tab-active');
    const tabPast = document.getElementById('tab-past');

    tabActive.addEventListener('click', () => switchTab('active'));
    tabPast.addEventListener('click', () => switchTab('past'));
});

function populateUserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("user-name").textContent = user.name || "Utente";
        document.getElementById("user-role").textContent = user.role || "Utente";
    }
}

function switchTab(tab) {
    const activeContainer = document.getElementById('active-bookings');
    const pastContainer = document.getElementById('past-bookings');
    const tabActive = document.getElementById('tab-active');
    const tabPast = document.getElementById('tab-past');

    if (tab === 'active') {
        activeContainer.classList.remove('hidden');
        pastContainer.classList.add('hidden');
        tabActive.classList.add('active-tab');
        tabPast.classList.remove('active-tab');
    } else {
        pastContainer.classList.remove('hidden');
        activeContainer.classList.add('hidden');
        tabPast.classList.add('active-tab');
        tabActive.classList.remove('active-tab');
    }
}

// Carica prenotazioni dall'API
async function loadBookings() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi essere loggato!');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('/api/bookings/my-bookings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || `Errore HTTP: ${res.status}`);
        }

        let bookings = await res.json();

        if (!Array.isArray(bookings)) {
            console.error('Bookings non è un array:', bookings);
            showMessage(bookings.error || 'Errore nel caricamento delle prenotazioni', 'error');
            return;
        }

        // Ordina: attive prima, poi passate, entrambe per start_time
        const now = new Date();
        bookings.sort((a, b) => {
            const aEnd = new Date(a.end_time);
            const bEnd = new Date(b.end_time);
            if ((aEnd >= now) && (bEnd < now)) return -1; // a attiva, b passata
            if ((aEnd < now) && (bEnd >= now)) return 1;  // a passata, b attiva
            return new Date(a.start_time) - new Date(b.start_time); // ordine cronologico
        });

        renderBookings(bookings);

    } catch (err) {
        console.error('Errore caricamento prenotazioni:', err);
        showMessage('Errore di rete o server durante il caricamento delle prenotazioni', 'error');
    }
}

function renderBookings(bookings) {
    const activeContainer = document.getElementById('active-bookings');
    const pastContainer = document.getElementById('past-bookings');

    activeContainer.innerHTML = '';
    pastContainer.innerHTML = '';

    if (bookings.length === 0) {
        activeContainer.innerHTML = `<div class="bg-white rounded-lg p-6 text-center">
            <p class="text-gray-600">Nessuna prenotazione trovata</p>
            <a href="catalogo.html" class="inline-block mt-4 bg-[#4a3729] text-white px-4 py-2 rounded hover:bg-[#5a4739] transition">
                Effettua la tua prima prenotazione
            </a>
        </div>`;
        return;
    }

    const now = new Date();

    bookings.forEach(booking => {
        const isActive = new Date(booking.end_time) > now; // fine prenotazione > ora corrente = attiva
        const container = isActive ? activeContainer : pastContainer;

        const statusText = isActive ? 'Attiva' : 'Completata';
        const statusClass = isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

        const bookingCard = document.createElement('div');
        bookingCard.className = 'bg-white rounded-lg shadow-md p-6 mb-4';
        bookingCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold text-[#4a3729]">${booking.Location?.name || 'Sede non disponibile'}</h3>
                    <p class="text-gray-600 text-sm mt-1">
                        ${booking.Location ? `${booking.Location.address}, ${booking.Location.city}` : 'Indirizzo non disponibile'}
                    </p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClass}">
                    ${statusText}
                </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">Data inizio</p>
                    <p class="font-medium">${formatDate(booking.start_time)}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Data fine</p>
                    <p class="font-medium">${formatDate(booking.end_time)}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Ora</p>
                    <p class="font-medium">${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</p>
                </div>
            </div>
            
            <div class="flex justify-between items-center border-t pt-4">
                <div>
                    <p class="text-sm text-gray-600">Prezzo totale</p>
                    <p class="text-lg font-bold text-[#4a3729]">€${parseFloat(booking.total_price).toFixed(2)}</p>
                </div>
                
                <div class="flex gap-2">
                    ${isActive ? `
                        <button onclick="cancelBooking(${booking.id})" 
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm">
                            Cancella
                        </button>
                    ` : `
                        <button onclick="rebook(${booking.location_id})" 
                                class="bg-[#4a3729] text-white px-4 py-2 rounded hover:bg-[#5a4739] transition text-sm">
                            Prenota di nuovo
                        </button>
                    `}
                </div>
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function cancelBooking(bookingId) {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        if (res.ok) {
            showMessage('Prenotazione cancellata con successo', 'success');
            loadBookings();
        } else {
            showMessage(data.error || 'Errore durante la cancellazione', 'error');
        }
    } catch (err) {
        console.error('Errore cancellazione:', err);
        showMessage('Errore di rete durante la cancellazione', 'error');
    }
}

function rebook(locationId) {
    window.location.href = `prenota.html?location=${locationId}`;
}



function showMessage(message, type = 'info') {
    const existingMessage = document.getElementById('flash-message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.id = 'flash-message';
    messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
    }`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        if (document.body.contains(messageDiv)) messageDiv.remove();
    }, 5000);
}
