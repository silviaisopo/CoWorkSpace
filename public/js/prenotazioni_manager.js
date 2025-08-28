/// Verifica che l'utente sia un manager autenticato
async function checkManagerAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Se non c'è token o user, reindirizza al login
    if (!token || !user) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return false;
    }

    // Verifica che l'utente sia un manager
    if (user.role !== 'manager') {
        alert('Accesso consentito solo ai manager!');
        window.location.href = 'index.html';
        return false;
    }

    // Verifica la validità del token con il server
    try {
        const res = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error('Token non valido');
        }

        const data = await res.json();
        return data.manager || user;

    } catch (err) {
        console.error('Errore autenticazione:', err);
        alert('Sessione scaduta, effettua nuovamente il login.');
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
}

// Funzione di logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Inizializzazione della dashboard manager
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticazione
    const manager = await checkManagerAuth();
    if (!manager) return;

    // Imposta le informazioni del manager nell'UI
    document.getElementById('user-name').textContent = manager.name || 'Manager';
    document.getElementById('user-role').textContent = manager.role || '';

    // Configura il logout
    setupLogout();

// Variabile globale per memorizzare le prenotazioni
let bookings = [];
let selectedBookingId = null;

// Funzione per ottenere tutte le prenotazioni
async function fetchBookings() {
    try {
        document.getElementById('loading-spinner').style.display = 'block';
        const response = await fetch('/api/bookings');

        if (!response.ok) {
            throw new Error('Errore nel caricamento delle prenotazioni');
        }

        bookings = await response.json();
        renderBookings();
        loadBookingsList();
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nel caricamento delle prenotazioni: ' + error.message);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Funzione per formattare la data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funzione per visualizzare tutte le prenotazioni
function renderBookings() {
    const container = document.getElementById('bookings-container');
    const noBookingsMessage = document.getElementById('no-bookings-message');

    // Applica filtri
    const statusFilter = document.getElementById('filter-status').value;
    const startDateFilter = document.getElementById('filter-start-date').value;
    const endDateFilter = document.getElementById('filter-end-date').value;

    let filteredBookings = bookings;

    if (statusFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }

    if (startDateFilter) {
        const startDate = new Date(startDateFilter);
        filteredBookings = filteredBookings.filter(booking => new Date(booking.start_time) >= startDate);
    }

    if (endDateFilter) {
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59); // Imposta alla fine del giorno
        filteredBookings = filteredBookings.filter(booking => new Date(booking.end_time) <= endDate);
    }

    if (filteredBookings.length === 0) {
        noBookingsMessage.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    noBookingsMessage.style.display = 'none';
    container.innerHTML = '';

    filteredBookings.forEach((booking) => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card bg-gray-50 p-4 rounded-lg border border-gray-200';
        bookingCard.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/3">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-semibold">ID: #${booking.id}</span>
                        <span class="px-2 py-1 rounded text-xs status-${booking.status}">${getStatusText(booking.status)}</span>
                    </div>
                    <p class="text-gray-600"><strong>Utente:</strong> ${booking.user_name || 'ID: ' + booking.user_id}</p>
                    <p class="text-gray-600"><strong>Sede:</strong> ${booking.location_name || 'ID: ' + booking.location_id}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-gray-600"><strong>Inizio:</strong> ${formatDate(booking.start_time)}</p>
                    <p class="text-gray-600"><strong>Fine:</strong> ${formatDate(booking.end_time)}</p>
                    <p class="text-gray-600"><strong>Durata:</strong> ${calculateDuration(booking.start_time, booking.end_time)}</p>
                </div>
                <div class="md:w-1/3">
                    <p class="text-green-700 font-bold text-lg">Totale: €${booking.total_price}</p>
                    <p class="text-gray-600 text-sm">Creata il: ${formatDate(booking.created_at)}</p>
                </div>
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

// Funzione per calcolare la durata
function calculateDuration(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}

// Funzione per ottenere il testo dello stato
function getStatusText(status) {
    const statusMap = {
        'pending': 'In attesa',
        'confirmed': 'Confermata',
        'cancelled': 'Cancellata',
        'completed': 'Completata'
    };
    return statusMap[status] || status;
}

// Funzione per caricare le prenotazioni nella lista di gestione
function loadBookingsList(query = "") {
    const bookingsList = document.getElementById("bookings-list");

    // Filtra le prenotazioni in base alla query di ricerca
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
                    <span class="px-2 py-1 rounded text-xs status-${booking.status} float-right">${getStatusText(booking.status)}</span>
                </li>`
        )
        .join("");
}

// Gestione selezione prenotazione
document.getElementById("bookings-list").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    selectedBookingId = li.dataset.id;

    // Rimuovi evidenziazione precedente
    document.querySelectorAll("#bookings-list li").forEach((el) => {
        el.classList.remove("selected-booking");
    });

    // Aggiungi evidenziazione alla prenotazione selezionata
    li.classList.add("selected-booking");

    // Imposta lo stato attuale nel dropdown
    const selectedBooking = bookings.find(b => b.id == selectedBookingId);
    if (selectedBooking) {
        document.getElementById("update-status").value = selectedBooking.status;
    }
});

// Gestione aggiornamento prenotazione
document.getElementById("update-booking").addEventListener("click", async () => {
    if (selectedBookingId === null) {
        alert("Seleziona prima una prenotazione da aggiornare");
        return;
    }

    const newStatus = document.getElementById("update-status").value;

    try {
        const response = await fetch(`/api/bookings/${selectedBookingId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Errore durante l'aggiornamento");
        }

        // Ricarica le prenotazioni dopo l'aggiornamento
        await fetchBookings();
        alert(`Prenotazione #${selectedBookingId} aggiornata a: ${getStatusText(newStatus)}`);
        selectedBookingId = null;

    } catch (error) {
        console.error('Errore:', error);
        alert("Errore durante l'aggiornamento: " + error.message);
    }
});

// Gestione ricerca
document.getElementById("search-booking").addEventListener("input", (e) => {
    loadBookingsList(e.target.value);
});

// Gestione filtri
document.getElementById("apply-filters").addEventListener("click", () => {
    renderBookings();
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});
});