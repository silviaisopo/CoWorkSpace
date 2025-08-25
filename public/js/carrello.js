// carrello.js

document.addEventListener("DOMContentLoaded", () => {
    const carrelloTable = document.getElementById("carrello-prodotti");

    // Simulazione prodotti dal "database"
    const prodotti = [
        { id: 1, nome: "Scrivania Privata", prezzo: 150, quantita: 1 },
        { id: 2, nome: "Postazione Condivisa", prezzo: 50, quantita: 2 }
    ];

    // Popola la tabella carrello
    prodotti.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${p.nome}</td>
      <td>€${p.prezzo}</td>
      <td><input type="number" min="1" value="${p.quantita}" class="w-16 text-center border rounded"></td>
      <td>€${(p.prezzo * p.quantita)}</td>
      <td><button class="bg-red-500 text-white px-2 py-1 rounded">Rimuovi</button></td>
    `;
        carrelloTable.appendChild(row);
    });

    // Aggiorna i totali
    function aggiornaTotale() {
        let subtotale = 0;
        carrelloTable.querySelectorAll("tr").forEach(row => {
            const qty = parseInt(row.querySelector("input").value);
            const prezzo = parseFloat(row.children[1].textContent.replace("€",""));
            const totale = qty * prezzo;
            row.children[3].textContent = `€${totale}`;
            subtotale += totale;
        });

        const iva = subtotale * 0.22;
        const totaleFinale = subtotale + iva;

        const summary = document.querySelector(".summary-card");
        summary.querySelector("#subtotale").textContent = `€${subtotale}`;
        summary.querySelector("#iva").textContent = `€${iva.toFixed(2)}`;
        summary.querySelector("#totale").textContent = `€${totaleFinale.toFixed(2)}`;
    }

    carrelloTable.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {
            if (parseInt(input.value) < 1) input.value = 1;
            aggiornaTotale();
        });
    });

    carrelloTable.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest("tr").remove();
            aggiornaTotale();
        });
    });

    aggiornaTotale();
});
