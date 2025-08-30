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

// Funzione per controllare autenticazione manager
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

// Logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Mostra messaggio a comparsa
function showMessage(message, isError = false) {
    const messageBox = document.getElementById('register-message');
    if (!messageBox) {
        alert(message);
        return;
    }
    messageBox.textContent = isError ? message : "✅ " + message;
    messageBox.style.display = "block";
    messageBox.style.background ="#f3f6f4" ;
    messageBox.style.color = isError ? "#dc3545" : "#28a745";
}

// Elimina account manager
async function deleteManagerAccount() {
    const confirmDelete = confirm("Sei sicuro di voler eliminare il tuo account? Tutte le sedi senza prenotazioni verranno eliminate.");
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) return showMessage("Token mancante", true);

    try {
        const res = await fetch('/api/manager/delete', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Errore eliminazione account');

        showMessage(data.message, false);
        localStorage.clear();
        setTimeout(() => window.location.href = 'login.html', 2000);

    } catch (err) {
        console.error(err);
        showMessage(err.message, true);
    }
}

// Dashboard manager
document.addEventListener('DOMContentLoaded', async () => {
    const manager = await checkManagerAuth();
    if (!manager) return;

    // Popola dati manager
    document.getElementById('user-name').textContent = manager.name || 'Manager';
    document.getElementById('user-role').textContent = manager.role || '';
    document.getElementById('user-name-detail').textContent = manager.name || '';
    document.getElementById('user-email').textContent = manager.email || '';
    document.getElementById('user-role-detail').textContent = manager.role || '';

    setupLogout();

    // Bottone elimina account
    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteManagerAccount);

    // Anteprima immagine
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(ev) {
                const preview = document.getElementById('image-preview');
                if (preview) {
                    preview.src = ev.target.result; // mostra anteprima
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Aggiunta sede
    const addForm = document.getElementById('add-location-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addForm);
            formData.append('manager_id', manager.id);

            // Validazione
            const requiredFields = ['name', 'address', 'city', 'type', 'description', 'capacity', 'price_per_hour'];
            for (let field of requiredFields) {
                if (!formData.get(field)) return alert('❌ Compila tutti i campi obbligatori.');
            }

            try {
                const token = localStorage.getItem('token');
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
                    if (typeof loadLocations === 'function') loadLocations();
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
