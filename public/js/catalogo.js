
document.addEventListener("DOMContentLoaded", async () => {
    const resultsContainer = document.getElementById("results");
    const filterForm = document.getElementById("filterForm");
    const tipoSelect = document.getElementById("tipo");
    const cittaInput = document.getElementById("citta");

    let locations = [];

    try {
        const res = await fetch("/api/locations/public");
        if (!res.ok) throw new Error("Errore nel recupero delle sedi");

        locations = await res.json();

        // --- SE ARRIVO DA index.html CON PARAMETRO search ---
        const params = new URLSearchParams(window.location.search);
        const search = params.get("search");

        if (search) {
            const q = search.toLowerCase();

            // 🔹 Popola automaticamente il campo città
            cittaInput.value = search;

            // 🔹 Filtro iniziale
            const filtered = locations.filter(item =>
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.city && item.city.toLowerCase().includes(q)) ||
                (item.services && item.services.toLowerCase().includes(q))
            );
            displayResults(filtered);
        } else {
            displayResults(locations);
        }

    } catch (err) {
        console.error("Errore fetch locations:", err);
        resultsContainer.innerHTML = `<p class="text-red-500">Impossibile caricare le sedi.</p>`;
    }

    // --- FILTRO DAL FORM ---
    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const tipo = tipoSelect.value.trim().toLowerCase();
        const citta = cittaInput.value.trim().toLowerCase();

        const filtered = locations.filter(item => {
            const matchTipo = !tipo || (item.type && item.type.toLowerCase() === tipo);
            const matchCitta = !citta || (item.city && item.city.toLowerCase().includes(citta));
            return matchTipo && matchCitta;
        });

        displayResults(filtered);
    });

    // --- FUNZIONE PER MOSTRARE RISULTATI ---
    function displayResults(list) {
        resultsContainer.innerHTML = "";

        if (!list || list.length === 0) {
            resultsContainer.innerHTML = `<p class="col-span-3 text-center text-gray-700">Nessuna sede disponibile.</p>`;
            return;
        }

        list.forEach(item => {
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

// --- PRENOTA ---
function goToPrenota(locationId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login per prenotare.');
        window.location.href = 'login.html';
        return;
    }

    // 🔹 Controllo ruolo utente
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "user") {
        alert("Prenotazione consentita solo con account utente. Gli account manager non possono prenotare.");
        return;
    }

    window.location.href = `prenota.html?location=${locationId}`;
}





