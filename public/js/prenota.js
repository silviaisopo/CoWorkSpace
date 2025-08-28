// prenota.js
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location');
    const locationDetails = document.getElementById('location-details');
    const availabilityList = document.getElementById('availability-list');
    const availabilityMsg = document.getElementById('availability-msg');
    const bookingSuccess = document.getElementById('booking-success');
    const bookingDate = document.getElementById('booking-date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const startTimeDropdown = document.getElementById('start-time-dropdown');
    const endTimeDropdown = document.getElementById('end-time-dropdown');
    const confirmButton = document.getElementById('confirm-booking');
    const priceDisplay = document.getElementById('price-display');
    const timeSlots = document.querySelectorAll('.time-slot');
    const clockPickers = document.querySelectorAll('.clock-picker');

    let location = null;
    let selectedDate = null;
    let selectedStartTime = null;
    let selectedEndTime = null;
    let selectedDuration = 0;
    let existingBookings = [];

    if (!locationId) {
        locationDetails.innerHTML = '<p class="text-red-500">Sede non selezionata.</p>';
        return;
    }

    // Controllo login
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Devi effettuare il login per prenotare.');
        window.location.href = 'login.html';
        return;
    }

    // Inizializza il calendario
    const datepicker = flatpickr(bookingDate, {
        locale: "it",
        minDate: "today",
        dateFormat: "d/m/Y",
        onChange: function(selectedDates, dateStr, instance) {
            selectedDate = dateStr;
            updateTimeOptions();
            updateFormState();
        }
    });

    // Genera opzioni orarie (dalle 8:00 alle 20:00)
    /*function generateTimeOptions() {
        let options = '';
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options += `<div class="clock-option" data-time="${timeValue}">${timeValue}</div>`;
            }
        }
        startTimeDropdown.innerHTML = options;
        endTimeDropdown.innerHTML = options;

        // Aggiungi event listener alle opzioni
        document.querySelectorAll('#start-time-dropdown .clock-option').forEach(option => {
            option.addEventListener('click', function() {
                selectedStartTime = this.dataset.time;
                startTimeInput.value = selectedStartTime;
                startTimeDropdown.classList.remove('show');
                updateEndTimeOptions();
                updateFormState();
            });
        });

        document.querySelectorAll('#end-time-dropdown .clock-option').forEach(option => {
            option.addEventListener('click', function() {
                selectedEndTime = this.dataset.time;
                endTimeInput.value = selectedEndTime;
                endTimeDropdown.classList.remove('show');
                calculateDuration();
                updateFormState();
            });
        });
    }*/
    function generateTimeOptions() {
        let options = '';
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options += `<div class="clock-option" data-time="${timeValue}">${timeValue}</div>`;
            }
        }
        startTimeDropdown.innerHTML = options;
        endTimeDropdown.innerHTML = options;

        // Aggiungi event listener alle opzioni
        document.querySelectorAll('#start-time-dropdown .clock-option').forEach(option => {
            option.addEventListener('click', function() {
                selectedStartTime = this.dataset.time;
                startTimeInput.value = selectedStartTime;
                startTimeDropdown.classList.remove('show');
                updateEndTimeOptions();
                updateFormState();
            });
        });

        document.querySelectorAll('#end-time-dropdown .clock-option').forEach(option => {
            option.addEventListener('click', function() {
                selectedEndTime = this.dataset.time;
                endTimeInput.value = selectedEndTime;
                endTimeDropdown.classList.remove('show');
                calculateDuration();
                updateFormState();
            });
        });
    }

    // Aggiorna le opzioni orarie in base alla data selezionata
    async function updateTimeOptions() {
        if (!selectedDate) return;

        try {
            const availableSlots = await loadAvailableSlots(selectedDate);

            document.querySelectorAll('.clock-option').forEach(option => {
                const timeValue = option.dataset.time;

                if (availableSlots.includes(timeValue)) {
                    option.style.opacity = '1';
                    option.style.pointerEvents = 'auto';
                } else {
                    option.style.opacity = '0.5';
                    option.style.pointerEvents = 'none';
                }
            });
        } catch (error) {
            console.error('Errore nell\'aggiornamento delle opzioni orarie:', error);
        }
    }

    // Aggiorna le opzioni per l'orario di fine
    function updateEndTimeOptions() {
        if (!selectedStartTime) return;

        const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;

        document.querySelectorAll('#end-time-dropdown .clock-option').forEach(option => {
            const [optionHour, optionMinute] = option.dataset.time.split(':').map(Number);
            const optionTotalMinutes = optionHour * 60 + optionMinute;

            if (optionTotalMinutes <= startTotalMinutes) {
                option.style.opacity = '0.5';
                option.style.pointerEvents = 'none';
            } else {
                option.style.opacity = '1';
                option.style.pointerEvents = 'auto';
            }
        });
    }

    // Calcola la durata in base agli orari di inizio e fine
    function calculateDuration() {
        if (!selectedStartTime || !selectedEndTime) return;

        const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
        const [endHour, endMinute] = selectedEndTime.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        selectedDuration = (endTotalMinutes - startTotalMinutes) / 60;
        updatePrice();

        // Seleziona automaticamente il pulsante di durata corrispondente
        timeSlots.forEach(slot => {
            if (parseInt(slot.dataset.hours) === selectedDuration) {
                slot.classList.add('selected');
            } else {
                slot.classList.remove('selected');
            }
        });
    }

    // Aggiorna il prezzo
    function updatePrice() {
        if (location && selectedDuration > 0) {
            // Converti il prezzo in numero (numeric(10,2) viene restituito come stringa)
            const price = parseFloat(location.price_per_hour);
            const total = price * selectedDuration;
            priceDisplay.textContent = `Totale: €${total.toFixed(2)}`;
        } else {
            priceDisplay.textContent = 'Totale: €0.00';
        }
    }

    // Controlla se el form è completo
    function updateFormState() {
        if (selectedDate && selectedStartTime && selectedEndTime) {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    }

    // Gestione click sui pulsanti di durata
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedDuration = parseInt(this.dataset.hours);

            if (selectedStartTime) {
                const [hours, minutes] = selectedStartTime.split(':').map(Number);
                const endDate = new Date(0, 0, 0, hours, minutes);
                endDate.setHours(endDate.getHours() + selectedDuration);

                const endHours = endDate.getHours().toString().padStart(2, '0');
                const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
                selectedEndTime = `${endHours}:${endMinutes}`;
                endTimeInput.value = selectedEndTime;

                updatePrice();
                updateFormState();
            }
        });
    });

    // Gestione dropdown orari
    clockPickers.forEach(picker => {
        const input = picker.querySelector('input');
        const dropdown = picker.querySelector('.clock-dropdown');

        input.addEventListener('focus', function() {
            dropdown.classList.add('show');
        });

        input.addEventListener('click', function() {
            dropdown.classList.toggle('show');
        });

        // Chiudi il dropdown quando si clicca fuori
        document.addEventListener('click', function(e) {
            if (!picker.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });

    // Carica info sede
    async function loadLocation() {
        try {
            const res = await fetch(`/api/locations/${locationId}`);

            if (!res.ok) throw new Error('Sede non trovata');
            location = await res.json();

            // Converti il prezzo in numero (numeric(10,2) viene restituito come stringa)
            const price = parseFloat(location.price_per_hour);

            locationDetails.innerHTML = `
                <div class="flex flex-col h-full">
                    <img src="${location.image_url || '/uploads/default.jpg'}" alt="${location.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h3 class="text-xl font-bold mb-2 text-[#4a3729]">${location.name}</h3>
                    <p class="text-gray-700 text-sm mb-2"><strong>Indirizzo:</strong> ${location.address}, ${location.city}</p>
                    <p class="text-gray-700 text-sm mb-2"><strong>Capienza:</strong> ${location.capacity} persone</p>
                    <p class="text-gray-700 text-sm mb-2"><strong>Prezzo orario:</strong> €${price.toFixed(2)}</p>
                    <p class="text-gray-700 text-sm mb-3"><strong>Servizi:</strong> ${location.services || "Nessuno"}</p>
                    <p class="text-gray-600 text-sm mt-auto">${location.description || ""}</p>
                </div>
            `;
        } catch (err) {
            console.error('Errore nel caricamento della sede:', err);
            locationDetails.innerHTML = `
                <div class="flex flex-col h-full">
                    <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <span class="text-gray-500">Immagine non disponibile</span>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-[#4a3729]">Sede #${locationId}</h3>
                    <p class="text-gray-700 text-sm mb-2"><strong>Indirizzo:</strong> Informazioni non disponibili</p>
                    <p class="text-gray-700 text-sm mb-2"><strong>Capienza:</strong> Informazioni non disponibili</p>
                    <p class="text-gray-700 text-sm mb-2"><strong>Prezzo orario:</strong> €0.00</p>
                    <p class="text-gray-700 text-sm mb-3"><strong>Servizi:</strong> Nessuno</p>
                    <p class="text-gray-600 text-sm mt-auto">Descrizione non disponibile</p>
                </div>
            `;
        }
    }

    async function loadAvailableSlots(date) {
        try {
            const formattedDate = date.split('/').reverse().join('-');
            const res = await fetch(`/api/bookings/available-slots/${locationId}/${formattedDate}`);

            if (!res.ok) throw new Error('Errore nel recupero slot disponibili');

            const data = await res.json();
            return data.availableSlots || [];
        } catch (err) {
            console.error('Errore nel caricamento slot disponibili:', err);
            return [];
        }
    }

    // Carica disponibilità prenotazioni
    async function loadAvailability() {
        try {
            const res = await fetch(`/api/bookings/location/${locationId}`);

            // Controlla se la risposta è HTML invece di JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Risposta non JSON dal server');
            }

            if (!res.ok) throw new Error('Errore nel recupero disponibilità');

            const existingBookings = await res.json();

            availabilityList.innerHTML = '';

            if (existingBookings.length === 0) {
                availabilityList.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">Nessuna prenotazione esistente</td></tr>';
                return;
            }

            existingBookings.forEach(b => {
                const row = document.createElement('tr');
                row.classList.add('hover:bg-gray-50');
                row.innerHTML = `
                <td class="p-4 border-b text-sm">${new Date(b.start_time).toLocaleDateString()}</td>
                <td class="p-4 border-b text-sm">${new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td class="p-4 border-b text-sm">${new Date(b.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            `;
                availabilityList.appendChild(row);
            });
        } catch (err) {
            console.error('Errore nel caricamento delle prenotazioni:', err);
            availabilityList.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-500">Errore nel caricamento delle prenotazioni</td></tr>';
        }
    }

    // Funzione per verificare la disponibilità prima della prenotazione
    async function checkAvailability(startTime, endTime) {
        try {
            const res = await fetch(`/api/bookings/check-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location_id: parseInt(locationId),
                    start_time: startTime,
                    end_time: endTime
                })
            });

            return res.ok;
        } catch (error) {
            console.error('Errore nel controllo disponibilità:', error);
            return false;
        }
    }

    // Gestione conferma prenotazione
    /*confirmButton.addEventListener('click', async () => {
        availabilityMsg.classList.add('hidden');
        bookingSuccess.classList.add('hidden');

        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
            availabilityMsg.textContent = 'Seleziona data, orario di inizio e fine';
            availabilityMsg.classList.remove('hidden');
            return;
        }

        // Formatta la data nel formato YYYY-MM-DD
        const [day, month, year] = selectedDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        const start_time = `${formattedDate}T${selectedStartTime}:00`;
        const end_time = `${formattedDate}T${selectedEndTime}:00`;

        // Verifica disponibilità
        const isAvailable = await checkAvailability(start_time, end_time);
        if (!isAvailable) {
            availabilityMsg.textContent = 'Questo slot orario non è più disponibile. Si prega di scegliere un altro orario.';
            availabilityMsg.classList.remove('hidden');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    location_id: parseInt(locationId),
                    start_time,
                    end_time
                })
            });

            // Controlla se la risposta è OK
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Errore sconosciuto' }));
                availabilityMsg.textContent = errorData.error || 'Errore durante la prenotazione';
                availabilityMsg.classList.remove('hidden');
                return;
            }

            const data = await res.json();

            bookingSuccess.textContent = 'Prenotazione confermata con successo!';
            bookingSuccess.classList.remove('hidden');

            // Reset del form
            datepicker.clear();
            startTimeInput.value = '';
            endTimeInput.value = '';
            selectedDate = null;
            selectedStartTime = null;
            selectedEndTime = null;
            selectedDuration = 0;
            confirmButton.disabled = true;
            priceDisplay.textContent = 'Totale: €0.00';
            timeSlots.forEach(s => s.classList.remove('selected'));

            // Ricarica la disponibilità
            await loadAvailability();

        } catch (err) {
            console.error('Errore durante la prenotazione:', err);
            availabilityMsg.textContent = 'Errore di connessione. Riprova più tardi.';
            availabilityMsg.classList.remove('hidden');
        }
    });*/
    // Modifica la funzione di conferma prenotazione
    confirmButton.addEventListener('click', async () => {
        availabilityMsg.classList.add('hidden');
        bookingSuccess.classList.add('hidden');

        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
            availabilityMsg.textContent = 'Seleziona data, orario di inizio e fine';
            availabilityMsg.classList.remove('hidden');
            return;
        }

        // Formatta la data nel formato YYYY-MM-DD
        const [day, month, year] = selectedDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        const start_time = `${formattedDate}T${selectedStartTime}:00`;
        const end_time = `${formattedDate}T${selectedEndTime}:00`;

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    location_id: parseInt(locationId),
                    start_time,
                    end_time
                })
            });

            const responseText = await res.text();

            // Prova a parsare come JSON, altrimenti usa il testo della risposta
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Risposta non JSON:', responseText);
                availabilityMsg.textContent = 'Errore nel server. Riprova più tardi.';
                availabilityMsg.classList.remove('hidden');
                return;
            }

            if (!res.ok) {
                availabilityMsg.textContent = data.error || 'Errore durante la prenotazione';
                availabilityMsg.classList.remove('hidden');
                return;
            }

            bookingSuccess.textContent = 'Prenotazione confermata con successo!';
            bookingSuccess.classList.remove('hidden');

            // Reset del form
            datepicker.clear();
            startTimeInput.value = '';
            endTimeInput.value = '';
            selectedDate = null;
            selectedStartTime = null;
            selectedEndTime = null;
            selectedDuration = 0;
            confirmButton.disabled = true;
            priceDisplay.textContent = 'Totale: €0.00';
            timeSlots.forEach(s => s.classList.remove('selected'));

            // Ricarica la disponibilità
            await loadAvailability();

        } catch (err) {
            console.error('Errore durante la prenotazione:', err);
            availabilityMsg.textContent = 'Errore di connessione. Riprova più tardi.';
            availabilityMsg.classList.remove('hidden');
        }
    });

    // Inizializza la pagina
    generateTimeOptions();
    await loadLocation();
    await loadAvailability();
});
