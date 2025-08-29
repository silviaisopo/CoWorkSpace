// Funzione per verificare autenticazione manager
/*async function checkManagerAuth() {
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
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Token non valido');

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

// Variabili globali
let locations = [];
let selectedLocationId = null;

// Funzione per ottenere tutte le sedi
async function fetchLocations() {
    const token = localStorage.getItem('token');
    try {
        document.getElementById('loading-spinner').style.display = 'block';

        const response = await fetch('http://localhost:3000/api/locations', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Errore nel caricamento delle sedi');

        locations = await response.json();
        renderLocations();
        loadLocationsList();

    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nel caricamento delle sedi: ' + error.message);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Rendering delle sedi
function renderLocations() {
    const container = document.getElementById('locations-container');
    const noLocationsMessage = document.getElementById('no-locations-message');

    if (locations.length === 0) {
        noLocationsMessage.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    noLocationsMessage.style.display = 'none';
    container.innerHTML = '';

    locations.forEach(location => {
        const locationCard = document.createElement('div');
        locationCard.className = 'location-card bg-gray-50 p-4 rounded-lg border border-gray-200';
        locationCard.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/3">
                    <img src="${location.image_url}" alt="${location.name}" class="w-full h-40 object-cover rounded-lg">
                </div>
                <div class="md:w-2/3">
                    <h3 class="font-bold text-lg">${location.name}</h3>
                    <p class="text-gray-600">${location.address}, ${location.city}</p>
                    <p class="text-gray-600">${location.type} - Capienza: ${location.capacity} persone</p>
                    <p class="text-gray-600">${location.description}</p>
                    <p class="text-gray-600">Servizi: ${location.services || 'Nessuno'}</p>
                    <p class="text-green-700 font-bold">€${location.price_per_hour}/ora</p>
                </div>
            </div>
        `;
        container.appendChild(locationCard);
    });
}

// Carica sedi nella lista di eliminazione
function loadLocationsList(query = "") {
    const locationsList = document.getElementById("locations-list");

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.city.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredLocations.length === 0) {
        locationsList.innerHTML = "<li class='p-2 text-gray-500'>Nessuna sede trovata</li>";
        return;
    }

    locationsList.innerHTML = filteredLocations
        .map(loc =>
            `<li data-id="${loc.id}" class="cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">${loc.name} - ${loc.city} (${loc.type})</li>`
        )
        .join("");
}

// Gestione selezione sede da eliminare
document.getElementById("locations-list").addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    selectedLocationId = li.dataset.id;

    document.querySelectorAll("#locations-list li").forEach(el => el.classList.remove("selected-location"));
    li.classList.add("selected-location");
});

// Eliminazione sede
document.getElementById("delete-location").addEventListener("click", async () => {
    if (!selectedLocationId) {
        alert("Seleziona prima una sede da eliminare");
        return;
    }

    if (!confirm("Sei sicuro di voler eliminare questa sede?")) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/locations/${selectedLocationId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Errore durante l'eliminazione");
        }

        await fetchLocations();
        alert("Sede eliminata con successo!");
        selectedLocationId = null;
        document.getElementById("search-location").value = "";

    } catch (error) {
        console.error('Errore:', error);
        alert("Errore durante l'eliminazione: " + error.message);
    }
});

// Ricerca sedi
document.getElementById("search-location").addEventListener("input", e => {
    loadLocationsList(e.target.value);
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    document.getElementById("user-name").textContent = manager.name || "Manager";
    document.getElementById("user-role").textContent = manager.role || "";

    fetchLocations();
});*/

// sedi_manager.js

// --- FUNZIONE DI AUTENTICAZIONE MANAGER ---
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
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Token non valido');

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

// --- VARIABILI GLOBALI ---
let locations = [];
let selectedLocationId = null;

// --- FETCH LOCATIONS ---
async function fetchLocations() {
    const token = localStorage.getItem('token');
    try {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'block';

        const res = await fetch('http://localhost:3000/api/locations/manager', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Errore nel caricamento delle sedi');

        locations = await res.json();
        renderLocations();
        loadLocationsList();

    } catch (err) {
        console.error('Errore fetchLocations:', err);
        alert('Errore nel caricamento delle sedi: ' + err.message);
    } finally {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'none';
    }
}

// --- RENDER SEDI PRINCIPALI ---
function renderLocations() {
    const container = document.getElementById('locations-container');
    const noMsg = document.getElementById('no-locations-message');
    if (!container) return;

    if (locations.length === 0) {
        if (noMsg) noMsg.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    if (noMsg) noMsg.style.display = 'none';
    container.innerHTML = '';

    locations.forEach(loc => {
        const card = document.createElement('div');
        card.className = 'location-card bg-gray-50 p-4 rounded-lg border border-gray-200';
        card.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-1/3">
                    <img src="${loc.image_url || '/uploads/default.jpg'}" alt="${loc.name}" class="w-full h-40 object-cover rounded-lg">
                </div>
                <div class="md:w-2/3">
                    <h3 class="font-bold text-lg">${loc.name}</h3>
                    <p class="text-gray-600">${loc.address}, ${loc.city}</p>
                    <p class="text-gray-600">${loc.type} - Capienza: ${loc.capacity} persone</p>
                    <p class="text-gray-600">${loc.description || ''}</p>
                    <p class="text-gray-600">Servizi: ${loc.services || 'Nessuno'}</p>
                    <p class="text-green-700 font-bold">€${loc.price_per_hour}/ora</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- LOAD LISTA SEDI PER ELIMINAZIONE / RICERCA ---
function loadLocationsList(query = "") {
    const list = document.getElementById("locations-list");
    if (!list) return;

    const filtered = locations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.city.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        list.innerHTML = "<li class='p-2 text-gray-500'>Nessuna sede trovata</li>";
        return;
    }

    list.innerHTML = filtered.map(loc =>
        `<li data-id="${loc.id}" class="cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors">${loc.name} - ${loc.city} (${loc.type})</li>`
    ).join("");
}

// --- SELEZIONE SEDE ---
document.getElementById("locations-list")?.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    selectedLocationId = li.dataset.id;
    document.querySelectorAll("#locations-list li").forEach(el => el.classList.remove("selected-location"));
    li.classList.add("selected-location");
});

// --- ELIMINAZIONE SEDE ---
document.getElementById("delete-location")?.addEventListener("click", async () => {
    if (!selectedLocationId) {
        alert("Seleziona prima una sede da eliminare");
        return;
    }
    if (!confirm("Sei sicuro di voler eliminare questa sede?")) return;

    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`/api/locations/${selectedLocationId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Errore durante l'eliminazione");
        }

        selectedLocationId = null;
        document.getElementById("search-location").value = "";
        await fetchLocations(); // <-- aggiorna lista e container
        alert("Sede eliminata con successo!");

    } catch (err) {
        console.error('Errore deleteLocation:', err);
        alert("Errore durante l'eliminazione: " + err.message);
    }
});

// --- RICERCA ---
document.getElementById("search-location")?.addEventListener("input", e => {
    loadLocationsList(e.target.value);
});

// --- LOGOUT ---
document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

// --- INIT ---
// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    document.getElementById("user-name").textContent = manager.name || "Manager";
    document.getElementById("user-role").textContent = manager.role || "";

    fetchLocations();
});

