document.addEventListener('DOMContentLoaded', () => {
    loadBookings();

    // TAB
    document.getElementById('tab-active').addEventListener('click', () => {
        document.getElementById('active-bookings').classList.remove('hidden');
        document.getElementById('past-bookings').classList.add('hidden');
        document.getElementById('tab-active').classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
        document.getElementById('tab-past').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
        document.getElementById('tab-past').classList.add('text-[#96c5a9]');
    });

    document.getElementById('tab-past').addEventListener('click', () => {
        document.getElementById('past-bookings').classList.remove('hidden');
        document.getElementById('active-bookings').classList.add('hidden');
        document.getElementById('tab-past').classList.add('border-b-2', 'border-[#38e07b]', 'text-white');
        document.getElementById('tab-active').classList.remove('border-b-2', 'border-[#38e07b]', 'text-white');
        document.getElementById('tab-active').classList.add('text-[#96c5a9]');
    });
});

async function loadBookings() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Devi essere loggato!');

    try {
        const res = await fetch('/api/bookings/mybookings', {
            headers: { 'x-auth-token': token }
        });
        const bookings = await res.json();

        const activeContainer = document.getElementById('active-bookings');
        const pastContainer = document.getElementById('past-bookings');
        activeContainer.innerHTML = '';
        pastContainer.innerHTML = '';

        const now = new Date();

        bookings.forEach(b => {
            const container = new Date(b.end_time) >= now ? activeContainer : pastContainer;
            const div = document.createElement('div');
            div.className = 'bg-[#d0c6be] border rounded-lg p-4 flex flex-col gap-2';
            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-[#212121]">${b.workspace.name}</h3>
                        <p class="text-[#2b2926] text-sm">${b.workspace.type} • Piano ${b.workspace.floor}</p>
                    </div>
                    <span class="bg-[#54422b] text-[#f3f6f4] text-xs font-bold px-2 py-1 rounded">
                        ${new Date(b.end_time) >= now ? 'Attiva' : 'Passata'}
                    </span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-sm mt-2 text-[#2b2926]">
                    <div>
                        <p>Data</p>
                        <p class="font-medium text-[#212121]">${new Date(b.start_time).toLocaleDateString()} - ${new Date(b.end_time).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p>Orario</p>
                        <p class="font-medium text-[#212121]">${new Date(b.start_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} - ${new Date(b.end_time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</p>
                    </div>
                    <div>
                        <p>Totale</p>
                        <p class="font-medium text-[#212121]">€ ${b.total_price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex gap-2 mt-2">
                    ${new Date(b.end_time) >= now
                ? `<button onclick="cancelBooking(${b.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Cancella</button>`
                : `<button onclick="rebook(${b.workspace_id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Riprenota</button>`}
                </div>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert('Errore nel caricamento delle prenotazioni');
    }
}

// CANCELLA PRENOTAZIONE
async function cancelBooking(id) {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            loadBookings();
        } else {
            alert(data.error || 'Errore durante la cancellazione');
        }
    } catch (err) {
        console.error(err);
        alert('Errore di rete');
    }
}

// RIPRENOTA
function rebook(workspaceId) {
    window.location.href = `catalogo.html?space=${workspaceId}`;
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

