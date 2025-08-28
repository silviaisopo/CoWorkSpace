/*document.addEventListener('DOMContentLoaded', () => {
    populateUserProfile();
    loadBookings();

    // TAB
    const tabActive = document.getElementById('tab-active');
    const tabPast = document.getElementById('tab-past');

    tabActive.addEventListener('click', () => switchTab('active'));
    tabPast.addEventListener('click', () => switchTab('past'));
});

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Se non sei loggato → redirect
    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // Popolo i dati dell'utente
    document.getElementById("user-name").textContent = user.name || "Utente";
    document.getElementById("user-role").textContent = user.role || "";

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
});

// Gestione tab attive/passate
function switchTab(tab) {
    const activeContainer = document.getElementById('active-bookings');
    const pastContainer = document.getElementById('past-bookings');
    const tabActive = document.getElementById('tab-active');
    const tabPast = document.getElementById('tab-past');

    if (tab === 'active') {
        activeContainer.classList.remove('hidden');
        pastContainer.classList.add('hidden');
        tabActive.classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
        tabPast.classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
        tabPast.classList.add('text-[#96c5a9]');
    } else {
        pastContainer.classList.remove('hidden');
        activeContainer.classList.add('hidden');
        tabPast.classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
        tabActive.classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
        tabActive.classList.add('text-[#96c5a9]');
    }
}

// Carica prenotazioni dall'API
async function loadBookings() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Devi essere loggato!');

    try {
        const res = await fetch('/api/bookings/mybookings', {
            headers: { 'x-auth-token': token }
        });

        const bookings = await res.json();

        if (!Array.isArray(bookings)) {
            console.error('Bookings non è un array:', bookings);
            alert(bookings.error || 'Errore nel caricamento delle prenotazioni');
            return;
        }

        renderBookings(bookings);

    } catch (err) {
        console.error(err);
        alert('Errore di rete durante il caricamento delle prenotazioni');
    }
}

// Mostra prenotazioni attive e passate
function renderBookings(bookings) {
    const activeContainer = document.getElementById('active-bookings');
    const pastContainer = document.getElementById('past-bookings');
    activeContainer.innerHTML = '';
    pastContainer.innerHTML = '';

    const now = new Date();

    bookings.forEach(b => {
        const container = new Date(b.end_time) >= now ? activeContainer : pastContainer;
        const div = document.createElement('div');
        div.className = 'bg-[#d0c6be] border rounded-lg p-4 flex flex-col gap-2';
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-[#212121]">${b.workspace.name}</h3>
                    <p class="text-[#2b2926] text-sm">${b.workspace.type} • Piano ${b.workspace.floor}</p>
                </div>
                <span class="bg-[#54422b] text-[#f3f6f4] text-xs font-bold px-2 py-1 rounded">
                    ${new Date(b.end_time) >= now ? 'Attiva' : 'Passata'}
                </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm mt-2 text-[#2b2926]">
                <div>
                    <p>Data</p>
                    <p class="font-medium text-[#212121]">${new Date(b.start_time).toLocaleDateString()} - ${new Date(b.end_time).toLocaleDateString()}</p>
                </div>
                <div>
                    <p>Orario</p>
                    <p class="font-medium text-[#212121]">${new Date(b.start_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} - ${new Date(b.end_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                <div>
                    <p>Totale</p>
                    <p class="font-medium text-[#212121]">€ ${b.total_price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex gap-2 mt-2">
                ${new Date(b.end_time) >= now
            ? `<button onclick="cancelBooking(${b.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Cancella</button>`
            : `<button onclick="rebook(${b.workspace_id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Riprenota</button>`}
            </div>
        `;
        container.appendChild(div);
    });
}

// CANCELLA PRENOTAZIONE
async function cancelBooking(id) {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            loadBookings();
        } else {
            alert(data.error || 'Errore durante la cancellazione');
        }
    } catch (err) {
        console.error(err);
        alert('Errore di rete');
    }
}

// RIPRENOTA
function rebook(workspaceId) {
    window.location.href = `catalogo.html?space=${workspaceId}`;
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}*/
// prenotazioni_utente.js
document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticazione
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // Popola i dati dell'utente
    populateUserProfile();

    // Carica le prenotazioni
    loadBookings();

    // Gestione tabs
    const tabActive = document.getElementById('tab-active');
    const tabPast = document.getElementById('tab-past');

    tabActive.addEventListener('click', () => switchTab('active'));
    tabPast.addEventListener('click', () => switchTab('past'));
});

// Popola il profilo utente
function populateUserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("user-name").textContent = user.name || "Utente";
        document.getElementById("user-role").textContent = user.role || "Utente";
    }
}

// Gestione tab attive/passate
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
        const res = await fetch('/api/bookings/mybookings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Gestione errori HTTP
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
            throw new Error(`Errore HTTP: ${res.status}`);
        }

        const bookings = await res.json();

        if (!Array.isArray(bookings)) {
            console.error('Bookings non è un array:', bookings);
            showMessage(bookings.error || 'Errore nel caricamento delle prenotazioni', 'error');
            return;
        }

        renderBookings(bookings);

    } catch (err) {
        console.error('Errore caricamento prenotazioni:', err);
        showMessage('Errore di rete durante il caricamento delle prenotazioni', 'error');
    }
}

// Mostra prenotazioni attive e passate
function renderBookings(bookings) {
    const activeContainer = document.getElementById('active-bookings');
    const pastContainer = document.getElementById('past-bookings');

    // Pulisci i contenitori
    activeContainer.innerHTML = '';
    pastContainer.innerHTML = '';

    // Messaggio se non ci sono prenotazioni
    if (bookings.length === 0) {
        activeContainer.innerHTML = `
            <div class="bg-white rounded-lg p-6 text-center">
                <p class="text-gray-600">Nessuna prenotazione trovata</p>
                <a href="catalogo.html" class="inline-block mt-4 bg-[#4a3729] text-white px-4 py-2 rounded hover:bg-[#5a4739] transition">
                    Effettua la tua prima prenotazione
                </a>
            </div>
        `;
        return;
    }

    const now = new Date();

    bookings.forEach(booking => {
        const isActive = new Date(booking.end_time) >= now;
        const container = isActive ? activeContainer : pastContainer;

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
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }">
                    ${isActive ? 'Attiva' : 'Completata'}
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

// Formatta la data
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Formatta l'ora
function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// CANCELLA PRENOTAZIONE
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
            loadBookings(); // Ricarica la lista
        } else {
            showMessage(data.error || 'Errore durante la cancellazione', 'error');
        }
    } catch (err) {
        console.error('Errore cancellazione:', err);
        showMessage('Errore di rete durante la cancellazione', 'error');
    }
}

// RIPRENOTA
function rebook(locationId) {
    window.location.href = `prenota.html?location=${locationId}`;
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Mostra messaggio
function showMessage(message, type = 'info') {
    // Rimuovi messaggi precedenti
    const existingMessage = document.getElementById('flash-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.id = 'flash-message';
    messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
    }`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Rimuovi automaticamente dopo 5 secondi
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            messageDiv.remove();
        }
    }, 5000);
}

// Aggiungi stili CSS per le tabs
const style = document.createElement('style');
style.textContent = `
    .active-tab {
        border-bottom: 2px solid #4a3729;
        color: #4a3729;
        font-weight: 600;
    }
    
    #tab-active, #tab-past {
        cursor: pointer;
        padding: 8px 16px;
        transition: all 0.2s ease;
    }
    
    #tab-active:hover, #tab-past:hover {
        background-color: #f0e6e0;
    }
    
    .hidden {
        display: none;
    }
`;
document.head.appendChild(style);

