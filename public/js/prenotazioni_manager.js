// prenotazioni_manager.js

/*// Verifica che l'utente sia un manager autenticato
async function checkManagerAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return false;
    }

    if (user.role !== 'manager') {
        alert('Accesso consentito solo ai manager!');
        window.location.href = 'index.html';
        return false;
    }

    // Verifica la validità del token con il server e prova a leggere eventuali sedi gestite
    try {
        const res = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            throw new Error('Token non valido o sessione scaduta');
        }

        const data = await res.json();
        // compatibilità: molte implementazioni restituiscono { manager: {...}} oppure direttamente l'oggetto manager
        return data.manager || data || user;
    } catch (err) {
        console.error('Errore autenticazione:', err);
        alert('Sessione scaduta, effettua nuovamente il login.');
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
}

// Funzione di logout (collega al bottone)
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Variabili globali
let bookings = [];
let managerLocations = []; // array di sedi (oggetti) gestite dal manager
let selectedBookingId = null;

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    // Popola UI header
    document.getElementById('user-name').textContent = manager.name || 'Manager';
    document.getElementById('user-role').textContent = manager.role || '';

    setupLogout();

    // Event listeners UI
    document.getElementById('search-booking')?.addEventListener('input', (e) => {
        loadBookingsList(e.target.value);
    });

    document.getElementById('apply-filters')?.addEventListener('click', () => {
        renderBookings();
    });

    document.getElementById('update-booking')?.addEventListener('click', updateSelectedBooking);

    // Lista click (delegation) - assicurati che #bookings-list esista nell'HTML
    const bookingsListEl = document.getElementById('bookings-list');
    if (bookingsListEl) {
        bookingsListEl.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            selectedBookingId = li.dataset.id;

            // evidenzia selezione
            document.querySelectorAll('#bookings-list li').forEach((el) => el.classList.remove('selected-booking'));
            li.classList.add('selected-booking');

            // imposta dropdown stato corrente
            const selected = bookings.find(b => b.id == selectedBookingId);
            if (selected) {
                const sel = document.getElementById('update-status');
                if (sel) sel.value = selected.status;
            }
        });
    }

    // Carica sedi del manager e prenotazioni
    await loadManagerLocationsAndBookings();
});

// ----------------------
// Fetch e logica
// ----------------------
async function loadManagerLocationsAndBookings() {
    const token = localStorage.getItem('token');
    try {
        // 1) Recupera profile (per ottenere eventuali sedi già incluse)
        const profileRes = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        let managerData = {};
        if (profileRes.ok) {
            managerData = await profileRes.json();
            // supporta sia { manager: {...} } sia oggetto diretto
            managerData = managerData.manager || managerData;
        } else {
            // se profile fallisce, non stoppiamo: tentiamo comunque di prendere le sedi con endpoint alternativo
            managerData = JSON.parse(localStorage.getItem('user')) || {};
        }

        // 2) Se il profile contiene le sedi gestite (es. managedLocations o locations), usale
        if (Array.isArray(managerData.managedLocations) && managerData.managedLocations.length > 0) {
            managerLocations = managerData.managedLocations;
        } else if (Array.isArray(managerData.locations) && managerData.locations.length > 0) {
            managerLocations = managerData.locations;
        } else {
            // 3) Fallback: prova a chiamare un endpoint che restituisce le sedi del manager
            // (molte implementazioni hanno /api/locations/manager o /api/manager/locations)
            const tried = await tryFetchManagerLocations(token);
            if (!tried) {
                // nessuna sede trovata dal server: managerLocations rimane vuoto
                managerLocations = [];
            }
        }

        // 4) Se il manager non ha sedi, mostra messaggio e non procedere
        if (!managerLocations || managerLocations.length === 0) {
            document.getElementById('no-bookings-message').textContent = 'Non gestisci ancora alcuna sede oppure non è possibile recuperare le sedi.';
            document.getElementById('no-bookings-message').style.display = 'block';
            document.getElementById('loading-spinner').style.display = 'none';
            // comunque proviamo a caricare bookings e filtrarli (potrebbe includere Location con manager_id)
        }

        // 5) Recupera tutte le prenotazioni dal server (autorizzate)
        await fetchBookingsAndFilterByManager(token);

    } catch (err) {
        console.error('Errore caricamento sedi/prenotazioni:', err);
        alert('Errore nel caricamento delle sedi o prenotazioni: ' + err.message);
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// tenta di ottenere sedi manager da endpoint alternativo; ritorna true se ha popolato managerLocations
async function tryFetchManagerLocations(token) {
    const possiblePaths = ['/api/locations/manager', '/api/manager/locations', '/api/locations/my-locations'];
    for (const p of possiblePaths) {
        try {
            const res = await fetch(p, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                managerLocations = data;
                return true;
            }
        } catch (e) {
            // ignora e prova il prossimo percorso
        }
    }
    return false;
}

// recupera bookings e filtra solo quelli delle sedi del manager
async function fetchBookingsAndFilterByManager(token) {
    try {
        document.getElementById('loading-spinner').style.display = 'block';

        const res = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Errore HTTP: ${res.status}`);
        }

        let allBookings = await res.json();

        // Se le prenotazioni includono l'oggetto Location (server-side eager loading), usalo per filtrare
        const managerId = JSON.parse(localStorage.getItem('user')).id;
        const locationIdsFromManager = managerLocations.map(l => l.id);

        let filtered = allBookings.filter(b => {
            // Se booking ha Location e Location.manager_id -> confronta
            if (b.Location && (b.Location.manager_id !== undefined)) {
                return b.Location.manager_id === managerId;
            }
            // Altrimenti usa la lista di locationIds recuperate
            if (locationIdsFromManager.length > 0) {
                return locationIdsFromManager.includes(b.location_id);
            }
            // se non abbiamo info dalle sedi, prova comunque a includere bookings che abbiano Location con campo manager_id === managerId
            if (b.Location && b.Location.manager_id !== undefined) {
                return b.Location.manager_id === managerId;
            }
            // fallback: non possiamo stabilire, escludi
            return false;
        });

        // Ordina per start_time desc (più recenti prima)
        filtered.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

        bookings = filtered;
        renderBookings();
        loadBookingsList();

    } catch (err) {
        console.error('Errore fetchBookingsAndFilterByManager:', err);
        alert('Errore nel recupero delle prenotazioni: ' + err.message);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// ----------------------
// Rendering e helpers
// ----------------------
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function calculateDuration(start, end) {
    const startTime = new Date(start), endTime = new Date(end);
    const diffMs = endTime - startTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function getStatusText(status) {
    const statusMap = { 'pending': 'In attesa', 'confirmed': 'Confermata', 'cancelled': 'Cancellata', 'completed': 'Completata' };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'confirmed': return 'status-confirmed';
        case 'cancelled': return 'status-cancelled';
        case 'completed': return 'status-completed';
        default: return '';
    }
}

function renderBookings() {
    const container = document.getElementById('bookings-container');
    const noBookingsMessage = document.getElementById('no-bookings-message');

    // filtri UI
    const statusFilter = document.getElementById('filter-status')?.value || '';
    const startDateFilter = document.getElementById('filter-start-date')?.value;
    const endDateFilter = document.getElementById('filter-end-date')?.value;

    let filtered = bookings.slice();

    if (statusFilter) filtered = filtered.filter(b => b.status === statusFilter);
    if (startDateFilter) {
        const s = new Date(startDateFilter);
        filtered = filtered.filter(b => new Date(b.start_time) >= s);
    }
    if (endDateFilter) {
        const e = new Date(endDateFilter); e.setHours(23,59,59);
        filtered = filtered.filter(b => new Date(b.end_time) <= e);
    }

    container.innerHTML = '';
    if (!filtered || filtered.length === 0) {
        noBookingsMessage.style.display = 'block';
        return;
    }
    noBookingsMessage.style.display = 'none';

    filtered.forEach((booking) => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card bg-gray-50 p-4 rounded-lg border border-gray-200';

        // prova a leggere nome utente e nome sede (se disponibili)
        const userName = booking.user_name || (booking.User && (booking.User.name || booking.User.email)) || ('ID: ' + booking.user_id);
        const locName = booking.location_name || (booking.Location && booking.Location.name) || ('ID: ' + booking.location_id);

        bookingCard.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/3">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-semibold">ID: #${booking.id}</span>
                        <span class="px-2 py-1 rounded text-xs ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span>
                    </div>
                    <p class="text-gray-600"><strong>Utente:</strong> ${userName}</p>
                    <p class="text-gray-600"><strong>Sede:</strong> ${locName}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-gray-600"><strong>Inizio:</strong> ${formatDate(booking.start_time)}</p>
                    <p class="text-gray-600"><strong>Fine:</strong> ${formatDate(booking.end_time)}</p>
                    <p class="text-gray-600"><strong>Durata:</strong> ${calculateDuration(booking.start_time, booking.end_time)}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-green-700 font-bold text-lg">Totale: €${parseFloat(booking.total_price).toFixed(2)}</p>
                    <p class="text-gray-600 text-sm">Creata il: ${formatDate(booking.created_at || booking.createdAt || '')}</p>
                </div>
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

// Carica la lista laterale con ricerca
function loadBookingsList(query = "") {
    const bookingsList = document.getElementById("bookings-list");
    if (!bookingsList) return;

    const filteredBookings = bookings.filter(booking =>
        booking.id.toString().includes(query) ||
        (booking.user_name && booking.user_name.toLowerCase().includes(query.toLowerCase())) ||
        (booking.location_name && booking.location_name.toLowerCase().includes(query.toLowerCase()))
    );

    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = "<li class='p-2 text-gray-500'>Nessuna prenotazione trovata</li>";
        return;
    }

    bookingsList.innerHTML = filteredBookings
        .map(
            (booking) =>
                `<li data-id="${booking.id}" class="cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">
                    #${booking.id} - ${booking.user_name || 'Utente ID:' + booking.user_id} - ${formatDate(booking.start_time)}
                    <span class="px-2 py-1 rounded text-xs ${getStatusClass(booking.status)} float-right">${getStatusText(booking.status)}</span>
                </li>`
        )
        .join("");
}

// ----------------------
// Aggiorna stato prenotazione (PATCH)
// ----------------------
async function updateSelectedBooking() {
    if (!selectedBookingId) {
        alert('Seleziona prima una prenotazione dalla lista a sinistra.');
        return;
    }

    const token = localStorage.getItem('token');
    const newStatus = document.getElementById('update-status')?.value;
    if (!newStatus) {
        alert('Seleziona uno stato valido.');
        return;
    }

    try {
        const res = await fetch(`/api/bookings/${selectedBookingId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Errore aggiornamento prenotazione');
        }

        // refresh
        await loadManagerLocationsAndBookings();
        alert(`Prenotazione #${selectedBookingId} aggiornata a: ${getStatusText(newStatus)}`);
        selectedBookingId = null;

    } catch (err) {
        console.error('Errore updateSelectedBooking:', err);
        alert('Errore durante l\'aggiornamento: ' + err.message);
    }
}*/

// prenotazioni_manager.js

// Verifica che l'utente sia un manager autenticato
async function checkManagerAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return false;
    }

    if (user.role !== 'manager') {
        alert('Accesso consentito solo ai manager!');
        window.location.href = 'index.html';
        return false;
    }

    try {
        const res = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Token non valido o sessione scaduta');

        const data = await res.json();
        return data.manager || data || user;
    } catch (err) {
        console.error('Errore autenticazione:', err);
        alert('Sessione scaduta, effettua nuovamente il login.');
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
}

// Funzione di logout (collega al bottone)
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Variabili globali
let bookings = [];
let managerLocations = [];
let selectedBookingId = null;

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');

    if (userNameEl) userNameEl.textContent = manager.name || 'Manager';
    if (userRoleEl) userRoleEl.textContent = manager.role || '';

    setupLogout();

    document.getElementById('search-booking')?.addEventListener('input', (e) => {
        loadBookingsList(e.target.value);
    });

    document.getElementById('apply-filters')?.addEventListener('click', () => {
        renderBookings();
    });

    document.getElementById('update-booking')?.addEventListener('click', updateSelectedBooking);

    const bookingsListEl = document.getElementById('bookings-list');
    if (bookingsListEl) {
        bookingsListEl.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            selectedBookingId = li.dataset.id;

            document.querySelectorAll('#bookings-list li').forEach((el) => el.classList.remove('selected-booking'));
            li.classList.add('selected-booking');

            const selected = bookings.find(b => b.id == selectedBookingId);
            const sel = document.getElementById('update-status');
            if (selected && sel) sel.value = selected.status;
        });
    }

    await loadManagerLocationsAndBookings();
});

// ----------------------
// Fetch e logica
// ----------------------
async function loadManagerLocationsAndBookings() {
    const token = localStorage.getItem('token');
    const spinner = document.getElementById('loading-spinner');
    const noBookingsMessage = document.getElementById('no-bookings-message');

    try {
        if (spinner) spinner.style.display = 'block';

        const profileRes = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        let managerData = {};
        if (profileRes.ok) {
            managerData = await profileRes.json();
            managerData = managerData.manager || managerData;
        } else {
            managerData = JSON.parse(localStorage.getItem('user')) || {};
        }

        if (Array.isArray(managerData.managedLocations) && managerData.managedLocations.length > 0) {
            managerLocations = managerData.managedLocations;
        } else if (Array.isArray(managerData.locations) && managerData.locations.length > 0) {
            managerLocations = managerData.locations;
        } else {
            const tried = await tryFetchManagerLocations(token);
            if (!tried) managerLocations = [];
        }

        if ((!managerLocations || managerLocations.length === 0) && noBookingsMessage) {
            noBookingsMessage.textContent = 'Non gestisci ancora alcuna sede oppure non è possibile recuperare le sedi.';
            noBookingsMessage.style.display = 'block';
            if (spinner) spinner.style.display = 'none';
        }

        await fetchBookingsAndFilterByManager(token);
    } catch (err) {
        console.error('Errore caricamento sedi/prenotazioni:', err);
        alert('Errore nel caricamento delle sedi o prenotazioni: ' + err.message);
        if (spinner) spinner.style.display = 'none';
    }
}

async function tryFetchManagerLocations(token) {
    const possiblePaths = ['/api/locations/manager', '/api/manager/locations', '/api/locations/my-locations'];
    for (const p of possiblePaths) {
        try {
            const res = await fetch(p, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                managerLocations = data;
                return true;
            }
        } catch (e) {}
    }
    return false;
}

async function fetchBookingsAndFilterByManager(token) {
    const spinner = document.getElementById('loading-spinner');
    const noBookingsMessage = document.getElementById('no-bookings-message');
    try {
        if (spinner) spinner.style.display = 'block';

        const res = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Errore HTTP: ${res.status}`);
        }

        let allBookings = await res.json();
        const now = new Date();
        const managerId = JSON.parse(localStorage.getItem('user')).id;
        const locationIdsFromManager = managerLocations.map(l => l.id);

        bookings = allBookings
            .filter(b => {
                if (b.Location && (b.Location.manager_id !== undefined)) return b.Location.manager_id === managerId;
                if (locationIdsFromManager.length > 0) return locationIdsFromManager.includes(b.location_id);
                return false;
            })
            .map(b => {
                // Stato di default: confermata
                if (!b.status || b.status === 'pending') b.status = 'confirmed';

                // Se la prenotazione è già passata, diventare completata
                if (new Date(b.end_time) < now) b.status = 'completed';
                return b;
            });

        bookings.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

        renderBookings();
        loadBookingsList();
    } catch (err) {
        console.error('Errore fetchBookingsAndFilterByManager:', err);
        alert('Errore nel recupero delle prenotazioni: ' + err.message);
    } finally {
        if (spinner) spinner.style.display = 'none';
        if (bookings.length === 0 && noBookingsMessage) noBookingsMessage.style.display = 'block';
    }
}

// ----------------------
// Rendering e helpers
// ----------------------
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function calculateDuration(start, end) {
    const diffMs = new Date(end) - new Date(start);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function getStatusText(status) {
    const statusMap = { 'pending': 'In attesa', 'confirmed': 'Confermata', 'cancelled': 'Cancellata', 'completed': 'Completata' };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'confirmed': return 'status-confirmed';
        case 'cancelled': return 'status-cancelled';
        case 'completed': return 'status-completed';
        default: return '';
    }
}

function renderBookings() {
    const container = document.getElementById('bookings-container');
    const noBookingsMessage = document.getElementById('no-bookings-message');
    if (!container) return;

    const statusFilter = document.getElementById('filter-status')?.value || '';
    const startDateFilter = document.getElementById('filter-start-date')?.value;
    const endDateFilter = document.getElementById('filter-end-date')?.value;

    let filtered = bookings.slice();
    if (statusFilter) filtered = filtered.filter(b => b.status === statusFilter);
    if (startDateFilter) filtered = filtered.filter(b => new Date(b.start_time) >= new Date(startDateFilter));
    if (endDateFilter) {
        const e = new Date(endDateFilter); e.setHours(23,59,59);
        filtered = filtered.filter(b => new Date(b.end_time) <= e);
    }

    container.innerHTML = '';
    if (!filtered || filtered.length === 0) {
        if (noBookingsMessage) noBookingsMessage.style.display = 'block';
        return;
    }
    if (noBookingsMessage) noBookingsMessage.style.display = 'none';

    filtered.forEach((booking) => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card bg-gray-50 p-4 rounded-lg border border-gray-200';

        const userName = booking.user_name || (booking.User && (booking.User.name || booking.User.email)) || ('ID: ' + booking.user_id);
        const locName = booking.location_name || (booking.Location && booking.Location.name) || ('ID: ' + booking.location_id);

        bookingCard.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/3">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-semibold">ID: #${booking.id}</span>
                        <span class="px-2 py-1 rounded text-xs ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span>
                    </div>
                    <p class="text-gray-600"><strong>Utente:</strong> ${userName}</p>
                    <p class="text-gray-600"><strong>Sede:</strong> ${locName}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-gray-600"><strong>Inizio:</strong> ${formatDate(booking.start_time)}</p>
                    <p class="text-gray-600"><strong>Fine:</strong> ${formatDate(booking.end_time)}</p>
                    <p class="text-gray-600"><strong>Durata:</strong> ${calculateDuration(booking.start_time, booking.end_time)}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-green-700 font-bold text-lg">Totale: €${parseFloat(booking.total_price).toFixed(2)}</p>
                    <p class="text-gray-600 text-sm">Creata il: ${formatDate(booking.created_at || booking.createdAt || '')}</p>
                </div>
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

// Carica la lista laterale con ricerca
function loadBookingsList(query = "") {
    const bookingsList = document.getElementById("bookings-list");
    if (!bookingsList) return;

    const filteredBookings = bookings.filter(booking =>
        booking.id.toString().includes(query) ||
        (booking.user_name && booking.user_name.toLowerCase().includes(query.toLowerCase())) ||
        (booking.location_name && booking.location_name.toLowerCase().includes(query.toLowerCase()))
    );

    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = "<li class='p-2 text-gray-500'>Nessuna prenotazione trovata</li>";
        return;
    }

    bookingsList.innerHTML = filteredBookings
        .map(
            (booking) =>
                `<li data-id="${booking.id}" class="cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">
                    #${booking.id} - ${booking.user_name || 'Utente ID:' + booking.user_id} - ${formatDate(booking.start_time)}
                    <span class="px-2 py-1 rounded text-xs ${getStatusClass(booking.status)} float-right">${getStatusText(booking.status)}</span>
                </li>`
        )
        .join("");
}

// ----------------------
// Aggiorna stato prenotazione (PATCH)
// ----------------------
async function updateSelectedBooking() {
    if (!selectedBookingId) {
        alert('Seleziona prima una prenotazione dalla lista a sinistra.');
        return;
    }

    const token = localStorage.getItem('token');
    const newStatus = document.getElementById('update-status')?.value;
    if (!newStatus) {
        alert('Seleziona uno stato valido.');
        return;
    }

    try {
        const res = await fetch(`/api/bookings/${selectedBookingId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Errore aggiornamento prenotazione');
        }

        await loadManagerLocationsAndBookings();
        alert(`Prenotazione #${selectedBookingId} aggiornata a: ${getStatusText(newStatus)}`);
        selectedBookingId = null;
    } catch (err) {
        console.error('Errore updateSelectedBooking:', err);
        alert('Errore durante l\'aggiornamento: ' + err.message);
    }
}

