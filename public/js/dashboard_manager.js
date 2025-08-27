/*document.addEventListener('DOMContentLoaded', async () => {
    const managerBox = document.getElementById('manager-info');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('/api/manager/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error('Token non valido');

        const manager = data.manager;
        managerBox.innerHTML = `
            <p>Nome: ${manager.name}</p>
            <p>Email: ${manager.email}</p>
            <p>Ruolo: ${manager.role}</p>
        `;
    } catch (err) {
        console.error(err);
        alert('Sessione scaduta, effettua nuovamente il login.');
        localStorage.clear();
        window.location.href = 'login.html';
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});*/
// dashboard_manager.js
document.addEventListener("DOMContentLoaded", async () => {
    // ==========================
    // 1️⃣ Mostra nome e ruolo
    // ==========================
    const manager = JSON.parse(localStorage.getItem("user")); // dati manager dal login
    if (manager) {
        document.getElementById("user-name").textContent = manager.name || "Manager";
        document.getElementById("user-role").textContent = manager.role || "manager";
    }

    // ==========================
    // 2️⃣ Aggiungi sede
    // ==========================
    const addForm = document.getElementById("add-location-form");
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(addForm);
        const data = Object.fromEntries(formData.entries());
        data.manager_id = manager?.id || null;

        // Validazione base
        if (!data.name || !data.address || !data.city || !data.type || !data.description || !data.capacity || !data.price_per_hour) {
            return alert("❌ Compila tutti i campi obbligatori.");
        }

        try {
            const res = await fetch("/api/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (res.ok) {
                alert("✅ Sede aggiunta con successo!");
                addForm.reset();
                loadLocations();
            } else {
                alert("❌ Errore: " + (result.error || "Problema server"));
            }
        } catch (err) {
            console.error(err);
            alert("❌ Errore di connessione al server");
        }
    });

    // ==========================
    // 3️⃣ Lista, ricerca ed elimina sedi
    // ==========================
    const locationsList = document.getElementById("locations-list");
    const searchInput = document.getElementById("search-location");
    const deleteBtn = document.getElementById("delete-location");
    let selectedLocationId = null;

    async function loadLocations(query = "") {
        try {
            const res = await fetch(`/api/locations?city=${encodeURIComponent(query)}`);
            const locations = await res.json();

            locationsList.innerHTML = locations
                .map(
                    (loc) =>
                        `<li data-id="${loc.id}" class="cursor-pointer hover:bg-gray-100 p-2 rounded">${loc.name} - ${loc.city} (${loc.type})</li>`
                )
                .join("");
        } catch (err) {
            console.error(err);
            locationsList.innerHTML = "<li>Errore nel caricamento delle sedi</li>";
        }
    }

    // Carica tutte le sedi inizialmente
    loadLocations();

    // Ricerca dinamica
    searchInput.addEventListener("input", () => {
        loadLocations(searchInput.value);
    });

    // Seleziona sede cliccata
    locationsList.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (!li) return;
        selectedLocationId = li.dataset.id;

        // evidenzia selezione
        locationsList.querySelectorAll("li").forEach((el) => el.classList.remove("bg-gray-200"));
        li.classList.add("bg-gray-200");
    });

    // Elimina sede selezionata
    deleteBtn.addEventListener("click", async () => {
        if (!selectedLocationId) return alert("Seleziona prima una sede da eliminare");
        if (!confirm("Sei sicuro di voler eliminare questa sede?")) return;

        try {
            const res = await fetch(`/api/locations/${selectedLocationId}`, {
                method: "DELETE",
            });
            const result = await res.json();

            if (res.ok) {
                alert("✅ Sede eliminata con successo!");
                selectedLocationId = null;
                loadLocations();
            } else {
                alert("❌ Errore: " + (result.error || "Problema server"));
            }
        } catch (err) {
            console.error(err);
            alert("❌ Errore di connessione al server");
        }
    });
});
