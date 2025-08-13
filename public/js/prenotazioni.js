document.getElementById('tab-active').addEventListener('click', function() {
    document.getElementById('active-bookings').classList.remove('hidden');
    document.getElementById('past-bookings').classList.add('hidden');
    this.classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-past').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-past').classList.add('text-[#96c5a9]');
});

document.getElementById('tab-past').addEventListener('click', function() {
    document.getElementById('past-bookings').classList.remove('hidden');
    document.getElementById('active-bookings').classList.add('hidden');
    this.classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-active').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
    document.getElementById('tab-active').classList.add('text-[#96c5a9]');
});

function cancelBooking(bookingId) {
    if(confirm("Sei sicuro di voler cancellare questa prenotazione?")) {
        // Logica per cancellare la prenotazione
        alert("Prenotazione cancellata con successo!");
        // Ricarica la pagina o rimuovi l'elemento dalla lista
    }
}

function rebook(spaceId) {
    // Logica per riprenotare lo stesso spazio
    window.location.href = `catalogo.html?space=${spaceId}`;
}

function logout() {
    // Logica di logout
    alert("Logout effettuato con successo!");
    window.location.href = "index.html";
}