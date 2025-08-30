// prenota.js
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get("location");
    const locationDetails = document.getElementById("location-details");
    const slotsGrid = document.getElementById("slots-grid");
    const bookingDate = document.getElementById("booking-date");
    const confirmButton = document.getElementById("confirm-booking");
    const priceDisplay = document.getElementById("price-display");
    const availabilityMsg = document.getElementById("availability-msg");

    let location = null;
    let selectedDate = null;
    let selectedSlots = []; // es: ["10:00", "11:00"]
    let existingBookings = [];

    // 🔹 Se non c’è la sede selezionata
    if (!locationId) {
        locationDetails.innerHTML = '<p class="text-red-500">Sede non selezionata.</p>';
        return;
    }

    // 🔹 Controllo login
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Devi effettuare il login per prenotare.");
        window.location.href = "login.html";
        return;
    }

    // 🔹 Datepicker
    const datepicker = flatpickr(bookingDate, {
        locale: "it",
        minDate: "today",
        dateFormat: "d/m/Y",
        onChange: async function (selectedDates, dateStr) {
            selectedDate = dateStr;
            selectedSlots = [];
            await renderDailySlots();
        },
    });

    // 🔹 Carica info sede
    // 🔹 Carica info sede
    async function loadLocation() {
        try {
            const res = await fetch(`/api/locations/${locationId}`);
            if (!res.ok) throw new Error("Errore nel recupero della sede");

            location = await res.json();

            locationDetails.innerHTML = `
            <img src="${location.image_url || '/uploads/default.jpg'}"
                 alt="${location.name}"
                 class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2 text-[#4a3729]">${location.name}</h3>
            <p class="mb-2"><strong>Indirizzo:</strong> ${location.address}, ${location.city}</p>
            <p class="mb-2"><strong>Capienza:</strong> ${location.capacity} persone</p>
            <p class="mb-4"><strong>Prezzo orario:</strong> €${parseFloat(location.price_per_hour).toFixed(2)}</p>
        `;
        } catch (error) {
            locationDetails.innerHTML = '<p class="text-red-500">Errore nel caricamento della sede.</p>';
            console.error(error);
        }
    }


    // 🔹 Carica prenotazioni già fatte
    async function loadBookings(date) {
        // Simulazione API call
        try {
            // Restituisce un array vuoto per simulare che non ci siano prenotazioni
            return [];
        } catch (error) {
            console.error("Errore nel caricamento delle prenotazioni:", error);
            return [];
        }
    }

    // 🔹 Genera slot giornalieri
    // 🔹 Genera slot giornalieri
    async function renderDailySlots() {
        slotsGrid.innerHTML = "";
        existingBookings = await loadBookings(selectedDate);

        // Orario corrente (solo ora, minuti a 0)
        const now = new Date();
        const currentHour = now.getHours();

        // Data selezionata (per capire se è oggi)
        const todayStr = now.toLocaleDateString("it-IT"); // formato "gg/mm/aaaa"
        const isToday = selectedDate === todayStr;

        for (let h = 8; h < 20; h++) {
            const slot = `${h.toString().padStart(2, "0")}:00`;
            const slotEnd = `${(h + 1).toString().padStart(2, "0")}:00`;

            // 🔹 controllo se slot è già prenotato
            const isBooked = existingBookings.some((b) => {
                const start = new Date(b.start_time);
                const end = new Date(b.end_time);
                const slotDate = new Date(
                    selectedDate.split("/").reverse().join("-") + "T" + slot + ":00"
                );
                return slotDate >= start && slotDate < end;
            });

            // 🔹 controllo se slot è nel passato (solo se è oggi)
            const isPast = isToday && h <= currentHour;

            const btn = document.createElement("button");
            btn.textContent = `${slot} - ${slotEnd}`;
            btn.className =
                "slot-button p-3 text-sm rounded-lg w-full " +
                (isBooked || isPast
                    ? "bg-gray-300 text-white cursor-not-allowed disabled"
                    : "bg-green-200 hover:bg-green-300");

            if (!isBooked && !isPast) {
                btn.addEventListener("click", () => toggleSlot(slot, btn));
            }

            slotsGrid.appendChild(btn);
        }
    }

    // 🔹 Selezione slot
    function toggleSlot(slot, btn) {
        if (selectedSlots.includes(slot)) {
            selectedSlots = selectedSlots.filter((s) => s !== slot);
            btn.classList.remove("bg-green-500", "text-white");
            btn.classList.add("bg-green-200");
        } else {
            selectedSlots.push(slot);
            selectedSlots.sort();
            btn.classList.remove("bg-green-200");
            btn.classList.add("bg-green-500", "text-white");
        }
        validateSelection();
    }

    // 🔹 Controlli su selezione
    function validateSelection() {
        if (selectedSlots.length === 0) {
            priceDisplay.textContent = "Totale: €0.00";
            confirmButton.disabled = true;
            return;
        }

        // controllo contiguità
        const hours = selectedSlots.map((s) => parseInt(s.split(":")[0], 10));
        for (let i = 1; i < hours.length; i++) {
            if (hours[i] !== hours[i - 1] + 1) {
                availabilityMsg.textContent = "Seleziona solo ore consecutive.";
                availabilityMsg.classList.remove("hidden");
                confirmButton.disabled = true;
                return;
            }
        }

        if (hours.length > 8) {
            availabilityMsg.textContent = "Puoi prenotare al massimo 8 ore.";
            availabilityMsg.classList.remove("hidden");
            confirmButton.disabled = true;
            return;
        }

        availabilityMsg.classList.add("hidden");
        const price = parseFloat(location.price_per_hour) * hours.length;
        priceDisplay.textContent = `Totale: €${price.toFixed(2)}`;
        confirmButton.disabled = false;
    }

    // 🔹 Conferma prenotazione → salva in localStorage e redirect al carrello
    confirmButton.addEventListener("click", () => {
        if (!selectedDate || selectedSlots.length === 0) return;

        const startHour = selectedSlots[0].split(":")[0];
        const endHour = parseInt(selectedSlots[selectedSlots.length - 1].split(":")[0]) + 1;

        // Genero ISO string per start_time e end_time
        const start_time = new Date(
            selectedDate.split("/").reverse().join("-") + `T${startHour}:00:00`
        ).toISOString();

        const end_time = new Date(
            selectedDate.split("/").reverse().join("-") + `T${endHour}:00:00`
        ).toISOString();

        const user = JSON.parse(localStorage.getItem("user")) || {};
        const totalPrice = parseFloat(location.price_per_hour) || 0;
        const bookingData = {
            user_id: user.id,
            location_id: location.id,
            location_name: location.name,
            start_time,
            end_time,
            hours: selectedSlots.length,
            total_price: totalPrice * selectedSlots.length,
            readable_date: selectedDate || ""
        };

        // Salvo la prenotazione temporanea
        localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
        updateCartBadge();

        // Redirect al carrello
        window.location.href = "carrello.html";
    });

    await loadLocation();
});