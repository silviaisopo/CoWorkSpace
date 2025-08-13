function logout() {
    // Logica di logout
    showNotification("Logout effettuato con successo!");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#38e07b] text-[#122118] px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in-up';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
document.addEventListener('DOMContentLoaded', function() {
    // Gestione logout
    const logoutButtons = document.querySelectorAll('[onclick="logout()"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', logout);
    });

    // Gestione tabs prenotazioni
    if(document.getElementById('tab-active')) {
        document.getElementById('tab-active').addEventListener('click', function() {
            showActiveBookings();
        });

        document.getElementById('tab-past').addEventListener('click', function() {
            showPastBookings();
        });
    }

    // Gestione modale profilo
    if(document.getElementById('modal')) {
        // Aggiungi qui eventuali listener aggiuntivi per la modale
    }

    // Gestione pulsanti modifica/cancella prenotazioni
    const cancelButtons = document.querySelectorAll('[onclick^="cancelBooking"]');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            cancelBooking(bookingId);
        });
    });

    const rebookButtons = document.querySelectorAll('[onclick^="rebook"]');
    rebookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const spaceId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            rebook(spaceId);
        });
    });
});

// Funzione per mostrare le prenotazioni attive
function showActiveBookings() {
    document.getElementById('active-bookings').classList.remove('hidden');
    document.getElementById('past-bookings').classList.add('hidden');
    document.getElementById('tab-active').classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-past').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-past').classList.add('text-[#96c5a9]');
}

// Funzione per mostrare le prenotazioni passate
function showPastBookings() {
    document.getElementById('past-bookings').classList.remove('hidden');
    document.getElementById('active-bookings').classList.add('hidden');
    document.getElementById('tab-past').classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-active').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-active').classList.add('text-[#96c5a9]');
}

// Funzione per cancellare una prenotazione
function cancelBooking(bookingId) {
    if(confirm("Sei sicuro di voler cancellare questa prenotazione?")) {
        // Qui dovresti fare una chiamata API per cancellare la prenotazione
        // Simuliamo la cancellazione con un timeout
        showNotification("Prenotazione cancellata con successo!");

        // Rimuovi l'elemento dalla lista dopo un ritardo
        setTimeout(() => {
            const bookingElement = document.querySelector(`[onclick="cancelBooking('${bookingId}')"]`).closest('.bg-[#264532]');
            if(bookingElement) {
                bookingElement.remove();
                updateBookingCounts();
            }
        }, 1000);
    }
}

// Funzione per riprenotare uno spazio
function rebook(spaceId) {
    showNotification("Reindirizzamento alla pagina di prenotazione...");
    setTimeout(() => {
        window.location.href = `catalogo.html?space=${spaceId}`;
    }, 1500);
}

// Funzione per aggiornare i contatori delle prenotazioni
function updateBookingCounts() {
    const activeCount = document.querySelectorAll('#active-bookings .bg-[#264532]').length;
    const pastCount = document.querySelectorAll('#past-bookings .bg-[#264532]').length;

    const activeCountElements = document.querySelectorAll('#active-bookings p.text-sm');
    const pastCountElements = document.querySelectorAll('#past-bookings p.text-sm');

    if(activeCountElements.length > 0) {
        activeCountElements[0].textContent = `${activeCount} prenotazioni`;
    }

    if(pastCountElements.length > 0) {
        pastCountElements[0].textContent = `${pastCount} prenotazioni`;
    }
}

// Funzione per il logout
function logout() {
    // Qui dovresti fare una chiamata API per il logout
    showNotification("Logout effettuato con successo!");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

// Funzione per mostrare notifiche
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#38e07b] text-[#122118] px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in-up';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funzione per aprire la modale
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    modal.classList.remove('hidden');

    if(type === 'email') {
        modalTitle.textContent = 'Modifica Email';
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Nuova Email</label>
                    <input type="email" id="new-email" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="nuova@email.com">
                </div>
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Conferma Email</label>
                    <input type="email" id="confirm-email" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="conferma@email.com">
                </div>
            </div>
        `;
    } else if(type === 'password') {
        modalTitle.textContent = 'Modifica Password';
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Password Attuale</label>
                    <input type="password" id="current-password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                </div>
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Nuova Password</label>
                    <input type="password" id="new-password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                </div>
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Conferma Password</label>
                    <input type="password" id="confirm-password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                </div>
            </div>
        `;
    } else if(type === 'phone') {
        modalTitle.textContent = 'Modifica Telefono';
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="text-[#96c5a9] text-sm mb-1 block">Nuovo Numero</label>
                    <input type="tel" id="new-phone" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="+39 123 456 7890">
                </div>
            </div>
        `;
    }
}

// Funzione per chiudere la modale
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Funzione per salvare le modifiche dalla modale
function saveChanges() {
    // Qui dovresti validare i dati e fare una chiamata API
    showNotification("Modifiche salvate con successo!");
    closeModal();
}

// Funzione per salvare il profilo
function saveProfile() {
    // Qui dovresti raccogliere i dati e fare una chiamata API
    showNotification("Profilo aggiornato con successo!");
}