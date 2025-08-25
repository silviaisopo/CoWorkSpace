// checkout.js
// checkout.js

document.addEventListener("DOMContentLoaded", () => {
    const formCheckout = document.getElementById("form-checkout");

    if (!formCheckout) return;

    // Simulazione "database" utente loggato
    const utenteLoggato = {
        nome: "Mario",
        cognome: "Rossi",
        email: "mario.rossi@email.com",
        telefono: "3331234567",
        note: "Preferisco la scrivania vicino alla finestra."
    };

    // Precompila i campi del form
    formCheckout.querySelector("#nome").value = utenteLoggato.nome;
    formCheckout.querySelector("#cognome").value = utenteLoggato.cognome;
    formCheckout.querySelector("#email").value = utenteLoggato.email;
    formCheckout.querySelector("#telefono").value = utenteLoggato.telefono;
    formCheckout.querySelector("#note").value = utenteLoggato.note;

    // Simulazione pagamento
    formCheckout.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = formCheckout.querySelector("#nome").value;
        const cognome = formCheckout.querySelector("#cognome").value;
        const email = formCheckout.querySelector("#email").value;

        setTimeout(() => {
            alert(`Pagamento simulato completato!\nGrazie ${nome} ${cognome}!\nRiceverai la conferma a ${email}.`);
            window.location.href = "index.html";
        }, 1000);
    });
});
