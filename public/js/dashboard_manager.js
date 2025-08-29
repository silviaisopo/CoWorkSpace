/*async function checkManagerAuth() {
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
    document.getElementById('user-name-detail').textContent = manager.name || '';
    document.getElementById('user-email').textContent = manager.email || '';
    document.getElementById('user-role-detail').textContent = manager.role || '';

    // Configura il logout
    setupLogout();

    const deleteAccountBtn = document.getElementById("delete-account-btn");
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async () => {
            if (!confirm("Sei sicuro di voler eliminare il tuo account manager?")) return;

            try {
                const res = await fetch("/api/manager/me", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error("Errore eliminazione account");

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Account manager eliminato con successo.");
                window.location.href = "login.html";
            } catch (err) {
                console.error("Errore eliminazione account manager:", err);
                alert("Errore durante l'eliminazione dell'account manager.");
            }
        });
    }


    // Gestione anteprima immagine
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    if (preview) {
                        preview.src = e.target.result;   // mostra anteprima
                        preview.style.display = 'block';
                    }

                    // NON impostiamo più image-url qui
                    // Il backend creerà l'URL corretto al momento del salvataggio

                    alert(`Immagine "${file.name}" selezionata. Verrà caricata sul server all'invio del form.`);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const addForm = document.getElementById('add-location-form');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addForm);
        formData.append('manager_id', manager.id);  // aggiungi id manager

        // Validazione
        if (!formData.get('name') || !formData.get('address') || !formData.get('city') ||
            !formData.get('type') || !formData.get('description') ||
            !formData.get('capacity') || !formData.get('price_per_hour')) {
            return alert('❌ Compila tutti i campi obbligatori.');
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("/api/locations", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('✅ Sede aggiunta con successo!');
                addForm.reset();

                // Nascondi anteprima immagine
                const preview = document.getElementById('image-preview');
                if (preview) preview.style.display = 'none';

                if (typeof loadLocations === 'function') loadLocations();
            } else {
                alert('❌ Errore: ' + (result.error || 'Problema server'));
            }
        } catch (err) {
            console.error(err);
            alert('❌ Errore di connessione al server');
        }
    });
});*/

// dashboard_manager.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Se non c'è token o user, reindirizza al login
    if (!token || !user) {
        alert('Devi effettuare il login!');
        window.location.href = 'login.html';
        return;
    }

    // Verifica ruolo manager
    if (user.role !== 'manager') {
        alert('Accesso consentito solo ai manager!');
        window.location.href = 'index.html';
        return;
    }

    // Imposta info manager nell'UI
    document.getElementById('user-name').textContent = user.name || 'Manager';
    document.getElementById('user-role').textContent = user.role || '';
    document.getElementById('user-name-detail').textContent = user.name || '';
    document.getElementById('user-email').textContent = user.email || '';
    document.getElementById('user-role-detail').textContent = user.role || '';

    // Funzione logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // Funzione elimina account manager
    const deleteAccountBtn = document.getElementById("delete-account-btn");
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async () => {
            if (!confirm("Sei sicuro di voler eliminare il tuo account manager e tutte le sedi associate?")) return;

            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/manager/me", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json(); // Leggi il JSON anche se res.ok è false

                if (!res.ok) {
                    // Se il backend ritorna un messaggio specifico, usalo
                    if (data.message) {
                        alert(data.message);
                    } else {
                        throw new Error("Errore eliminazione account");
                    }
                    return;
                }

                localStorage.clear();
                alert(data.message || "Account manager eliminato con successo.");
                window.location.href = "login.html";

            } catch (err) {
                console.error("Errore eliminazione account manager:", err);
                alert("Errore durante l'eliminazione dell'account manager: " + err.message);
            }
        });
    }


    // Funzione caricamento sedi
    async function loadLocations() {
        try {
            const res = await fetch("/api/locations/my-locations", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Errore caricamento sedi");
            const locations = await res.json();

            const container = document.getElementById("locations-container");
            if (!container) return;

            container.innerHTML = "";
            locations.forEach(loc => {
                const card = document.createElement("div");
                card.className = "bg-white rounded-lg shadow-md p-4 mb-4";
                card.innerHTML = `
                    <h3 class="font-bold text-lg">${loc.name}</h3>
                    <p>${loc.address}, ${loc.city}</p>
                    <p>Capacità: ${loc.capacity} - Prezzo/h: €${loc.price_per_hour}</p>
                `;
                container.appendChild(card);
            });
        } catch (err) {
            console.error("Errore caricamento sedi:", err);
        }
    }

    // Carica sedi manager
    loadLocations();

    // Event listener per aggiungere sede (già esistente nel tuo codice)
    const addForm = document.getElementById('add-location-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addForm);
            formData.append('manager_id', user.id);

            if (!formData.get('name') || !formData.get('address') || !formData.get('city') ||
                !formData.get('type') || !formData.get('description') ||
                !formData.get('capacity') || !formData.get('price_per_hour')) {
                return alert('❌ Compila tutti i campi obbligatori.');
            }

            try {
                const response = await fetch("/api/locations", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    alert('✅ Sede aggiunta con successo!');
                    addForm.reset();
                    const preview = document.getElementById('image-preview');
                    if (preview) preview.style.display = 'none';
                    loadLocations();
                } else {
                    alert('❌ Errore: ' + (result.error || 'Problema server'));
                }
            } catch (err) {
                console.error(err);
                alert('❌ Errore di connessione al server');
            }
        });
    }
});
