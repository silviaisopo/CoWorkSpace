document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // Popola dati utente
    document.getElementById("user-name").textContent = user.name || "Utente";
    document.getElementById("user-role").textContent = user.role || "";
    document.getElementById("user-name-detail").textContent = user.name || "";
    document.getElementById("user-email").textContent = user.email || "";
    document.getElementById("user-role-detail").textContent = user.role || "";

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    loadUserStats();
    loadBookings();
});

async function loadUserStats() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("/api/bookings/my-bookings", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Errore caricamento statistiche");

        const bookings = await res.json();

        const now = new Date();
        const activeBookings = bookings.filter(b => new Date(b.end_time) > now);
        const pastBookings = bookings.filter(b => new Date(b.end_time) <= now);

        // Aggiorna numeri nella dashboard
        document.querySelector("#dashboard-active").textContent = activeBookings.length;
        document.querySelector("#dashboard-past").textContent = pastBookings.length;

        // Prossima prenotazione: solo la più vicina nel futuro
        const nextBooking = activeBookings
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];

        if (nextBooking) {
            document.querySelector("#dashboard-next").textContent =
                formatDate(nextBooking.start_time);
        } else {
            document.querySelector("#dashboard-next").textContent = "Nessuna";
        }

    } catch (err) {
        console.error("Errore caricamento statistiche:", err);
    }
}

async function loadBookings() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("/api/bookings/my-bookings", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Errore caricamento prenotazioni");

        const bookings = await res.json();

        renderBookings(bookings);

    } catch (err) {
        console.error("Errore caricamento prenotazioni:", err);
    }
}

function renderBookings(bookings) {
    const activeContainer = document.getElementById("active-bookings");
    //const pastContainer = document.getElementById("past-bookings");

    activeContainer.innerHTML = "";
    //pastContainer.innerHTML = "";

    if (!Array.isArray(bookings) || bookings.length === 0) {
        activeContainer.innerHTML = `<p class="text-gray-600">Nessuna prenotazione trovata</p>`;
        return;
    }

    const now = new Date();

    bookings.forEach(booking => {
        const isActive = new Date(booking.end_time) > now;
        const statusText = isActive ? "Attiva" : "Completata";
        const statusClass = isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

        const container = isActive ? activeContainer : pastContainer;

        const bookingCard = document.createElement("div");
        bookingCard.className = "bg-white rounded-lg shadow-md p-6 mb-4";
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
                
            </div>
        `;
        container.appendChild(bookingCard);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("it-IT", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function rebook(locationId) {
    window.location.href = `prenota.html?location=${locationId}`;
}





