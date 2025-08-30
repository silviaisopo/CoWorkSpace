// carrello.js
document.addEventListener("DOMContentLoaded", () => {
    const bookingSummary = document.getElementById("booking-summary");
    const paymentForm = document.getElementById("payment-form");
    const confirmMsg = document.getElementById("confirm-msg");
    const errorMsg = document.getElementById("error-msg");

    // Dati utente dal login (localStorage)
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('user-name').textContent = user?.name || '';
    document.getElementById('user-email').textContent = user?.email || '';

    // Prenotazione temporanea
    const pendingBooking = JSON.parse(localStorage.getItem("pendingBooking"));
    console.log("Pending booking letto in carrello:", pendingBooking);
    if (!pendingBooking) {
        bookingSummary.innerHTML = "<p class='text-red-500'>Nessuna prenotazione trovata.</p>";
        paymentForm.classList.add("hidden");
        return;
    }

    const totalPrice = pendingBooking.total_price || 0;

    // Mostra riepilogo prenotazione
    bookingSummary.innerHTML = `
        <h2 class="text-xl font-bold mb-3">Riepilogo Prenotazione</h2>
        <p><strong>Sede:</strong> ${pendingBooking.location_name}</p>
        <p><strong>Data:</strong> ${pendingBooking.readable_date || 'Non specificata'}</p>
        <p><strong>Orario:</strong> ${new Date(pendingBooking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
            ${new Date(pendingBooking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <p><strong>Ore:</strong> ${pendingBooking.hours}</p>
        <p><strong>Totale:</strong> €${totalPrice.toFixed(2)}</p>
    `;

    // Gestione pagamento
    paymentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        confirmMsg.classList.add("hidden");
        errorMsg.classList.add("hidden");

        const cardNumber = document.getElementById("card-number").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;

        if (!cardNumber || !expiry || !cvv) {
            errorMsg.textContent = "Inserisci tutti i dati della carta.";
            errorMsg.classList.remove("hidden");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // Corpo della richiesta corretto
            const res = await fetch("/api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    booking: {
                        user_id: user.id,
                        location_id: pendingBooking.location_id,
                        start_time: pendingBooking.start_time,
                        end_time: pendingBooking.end_time,
                        total_price: pendingBooking.total_price,
                        payment_method: "carta di credito",
                        card_number: cardNumber
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Errore nel pagamento");
            }

            confirmMsg.textContent = "✅ Pagamento completato! Prenotazione confermata.";
            confirmMsg.classList.remove("hidden");
            localStorage.removeItem("pendingBooking");

            setTimeout(() => {
                window.location.href = "prenotazioni_utente.html";
            }, 3000);

        } catch (err) {
            errorMsg.textContent = "❌ " + err.message;
            errorMsg.classList.remove("hidden");
        }
    });
});
