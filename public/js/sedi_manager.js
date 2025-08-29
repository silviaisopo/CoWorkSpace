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

// --- SELEZIONE SEDE E FETCH DETTAGLIO ---
document.getElementById("locations-list")?.addEventListener("click", async e => {
    const li = e.target.closest("li");
    if (!li) return;

    selectedLocationId = li.dataset.id;
    document.querySelectorAll("#locations-list li").forEach(el => el.classList.remove("selected-location"));
    li.classList.add("selected-location");

    // fetch dettagli sede
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/locations/${selectedLocationId}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Errore caricamento dettagli sede');
        const location = await res.json();
        console.log(location); // puoi aggiornare il DOM con i dettagli
    } catch (err) {
        console.error('Errore fetch singola sede:', err);
    }
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

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Errore durante l'eliminazione");

        selectedLocationId = null;
        document.getElementById("search-location").value = "";
        await fetchLocations(); // aggiorna lista e container
        alert(data.message || "Sede eliminata con successo!");

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
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    document.getElementById("user-name").textContent = manager.name || "Manager";
    document.getElementById("user-role").textContent = manager.role || "";

    fetchLocations();
});

