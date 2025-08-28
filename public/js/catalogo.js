// public/js/catalogo.js

/*document.addEventListener("DOMContentLoaded", async () => {
    const resultsContainer = document.getElementById("results");

    try {
        const res = await fetch("/api/locations");
        if (!res.ok) throw new Error("Errore nel recupero delle sedi");

        const locations = await res.json();
        displayResults(locations);
    } catch (err) {
        console.error("Errore fetch locations:", err);
        resultsContainer.innerHTML = `<p class="error">Impossibile caricare le sedi.</p>`;
    }
});

function displayResults(locations) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (locations.length === 0) {
        resultsContainer.innerHTML = `<p>Nessuna sede disponibile.</p>`;
        return;
    }

    locations.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <img src="${item.image_url || '/uploads/default.jpg'}" alt="${item.name}" class="card-img">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p><strong>Indirizzo:</strong> ${item.address}, ${item.city}</p>
        <p><strong>Capienza:</strong> ${item.capacity} persone</p>
        <p><strong>Prezzo orario:</strong> €${item.price_per_hour}</p>
        <p><strong>Servizi:</strong> ${item.services || "Nessuno"}</p>
        <p>${item.description || ""}</p>
      </div>
    `;
        resultsContainer.appendChild(card);
    });
}*/

// public/js/catalogo.js

document.addEventListener("DOMContentLoaded", async () => {
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
        resultsContainer.innerHTML = `<p class="error">Impossibile caricare le sedi.</p>`;
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
        const card = document.createElement("div");
        card.className = "card bg-white rounded-lg shadow p-4";

        card.innerHTML = `
            <img src="${item.image_url || '/uploads/default.jpg'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-3">
            <div class="card-body">
                <h3 class="text-lg font-bold mb-1">${item.name}</h3>
                <p class="text-gray-700 mb-1"><strong>Indirizzo:</strong> ${item.address}, ${item.city}</p>
                <p class="text-gray-700 mb-1"><strong>Capienza:</strong> ${item.capacity} persone</p>
                <p class="text-gray-700 mb-1"><strong>Prezzo orario:</strong> €${item.price_per_hour}</p>
                <p class="text-gray-700 mb-1"><strong>Servizi:</strong> ${item.services || "Nessuno"}</p>
                <p class="text-gray-600">${item.description || ""}</p>
            </div>
        `;

        resultsContainer.appendChild(card);
    });
}


