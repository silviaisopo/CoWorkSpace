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
});