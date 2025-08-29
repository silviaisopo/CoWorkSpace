// public/js/catalogo.js

document.addEventListener("DOMContentLoaded", async () => {
    const resultsContainer = document.getElementById("results");

    let locations = [];

    try {
        const res = await fetch("/api/locations/public");
        if (!res.ok) throw new Error("Errore nel recupero delle sedi");

        locations = await res.json();
        displayResults(locations);

    } catch (err) {
        console.error("Errore fetch locations:", err);
        resultsContainer.innerHTML = `<p class="text-red-500">Impossibile caricare le sedi.</p>`;
    }

    function displayResults(locations) {
        resultsContainer.innerHTML = "";

        if (!locations || locations.length === 0) {
            resultsContainer.innerHTML = `<p class="col-span-3 text-center text-gray-700">Nessuna sede disponibile.</p>`;
            return;
        }

        locations.forEach(item => {
            const card = document.createElement("div");
            card.className = "card bg-white rounded-lg shadow p-4 border-[#4a3729] border mb-4";

            card.innerHTML = `
        <img src="${item.image_url || '/uploads/default.jpg'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-3">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-1">${item.name}</h3>
          <p class="text-gray-700 mb-1"><strong>Indirizzo:</strong> ${item.address}, ${item.city}</p>
          <p class="text-gray-700 mb-1"><strong>Capienza:</strong> ${item.capacity} persone</p>
          <p class="text-gray-700 mb-1"><strong>Prezzo orario:</strong> €${item.price_per_hour}</p>
          <p class="text-gray-700 mb-1"><strong>Servizi:</strong> ${item.services || "Nessuno"}</p>
          <p class="text-gray-600 mb-3">${item.description || ""}</p>
          <div class="flex justify-end">
            <button class="bg-[#4a3729] text-[#f3f6f4] px-4 py-2 rounded" onclick="goToPrenota(${item.id})">Prenota</button>
            </div>
        </div>
      `;

            resultsContainer.appendChild(card);
        });
    }
});

function goToPrenota(locationId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login per prenotare.');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `prenota.html?location=${locationId}`;
}



// public/js/catalogo.js
// public/js/catalogo.js

/*document.addEventListener("DOMContentLoaded", async () => {
    const resultsContainer = document.getElementById("results");
    const filterForm = document.getElementById("filterForm");

    let locations = [];

    // Carica tutte le sedi all'inizio
    try {
        const res = await fetch("/api/locations/public");
        if (!res.ok) throw new Error("Errore nel recupero delle sedi");

        locations = await res.json();
        displayResults(locations);

    } catch (err) {
        console.error("Errore fetch locations:", err);
        resultsContainer.innerHTML = `<p class="text-red-500">Impossibile caricare le sedi.</p>`;
    }

    // Gestione filtri
    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const tipo = document.getElementById("tipo").value.trim().toLowerCase();
        const citta = document.getElementById("citta").value.trim().toLowerCase();
        const strumento = document.getElementById("strumento").value.trim().toLowerCase();

        const filtered = locations.filter(loc => {
            let match = true;
            if (tipo) match = match && loc.type.toLowerCase() === tipo;
            if (citta) match = match && loc.city.toLowerCase().includes(citta);
            if (strumento) match = match && loc.services?.toLowerCase().includes(strumento);
            return match;
        });

        displayResults(filtered);
    });
});

function displayResults(locations) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (!locations || locations.length === 0) {
        resultsContainer.innerHTML = `<p class="col-span-3 text-center text-gray-700">Nessuna sede disponibile.</p>`;
        return;
    }

    locations.forEach(item => {
        const card = document.createElement('div');
        card.className = "card bg-white rounded-lg shadow p-4 border border-[#4a3729]";

        card.innerHTML = `
            <img src="${item.image_url || '/uploads/default.jpg'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-3">
            <div class="card-body">
                <h3 class="text-lg font-bold mb-1">${item.name}</h3>
                <p class="text-gray-700 mb-1"><strong>Indirizzo:</strong> ${item.address}, ${item.city}</p>
                <p class="text-gray-700 mb-1"><strong>Capienza:</strong> ${item.capacity} persone</p>
                <p class="text-gray-700 mb-1"><strong>Prezzo orario:</strong> €${item.price_per_hour}</p>
                <p class="text-gray-700 mb-1"><strong>Servizi:</strong> ${item.services || "Nessuno"}</p>
                <p class="text-gray-600 mb-3">${item.description || ""}</p>
                <div class="flex justify-end">
                    <button class="bg-[#4a3729] text-[#f3f6f4] px-4 py-2 rounded" onclick="goToPrenota(${item.id})">Prenota</button>
                </div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

function goToPrenota(locationId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login per prenotare.');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `prenota.html?location=${locationId}`;
}*/
