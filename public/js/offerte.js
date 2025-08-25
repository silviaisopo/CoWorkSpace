// Esempio di dati dal database
// In produzione questi dati arrivano via API (fetch)
const offersData = [
    {
        tipo: "Giornaliero",
        descrizione: "Postazione in scrivania condivisa per uno o più giorni",
        prezzo: 25,
        unità: "giorno",
        disponibilità: [
            { data: "2025-08-21", orario: "09:00 - 18:00", posti: 5 },
            { data: "2025-08-22", orario: "09:00 - 18:00", posti: 3 },
            { data: "2025-08-23", orario: "09:00 - 18:00", posti: 7 }
        ]
    },
    {
        tipo: "Settimanale",
        descrizione: "Scrivania condivisa per un'intera settimana (7 giorni)",
        prezzo: 100,
        unità: "settimana",
        disponibilità: [
            { data_inizio: "2025-08-21", data_fine: "2025-08-27", posti: 2 },
            { data_inizio: "2025-08-28", data_fine: "2025-09-03", posti: 3 }
        ]
    },
    {
        tipo: "Mensile",
        descrizione: "Scrivania dedicata per un intero mese (30 giorni)",
        prezzo: 350,
        unità: "mese",
        disponibilità: [
            { mese: "Agosto 2025", posti: 1 },
            { mese: "Settembre 2025", posti: 3 }
        ]
    }
];

// Funzione per creare le tabelle dinamiche
function createTable(offer) {
    let table = document.createElement("table");
    table.className = "w-full text-sm text-left text-[#2b2926] mb-6 border-collapse border border-gray-300";

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    if (offer.tipo === "Giornaliero") {
        thead.innerHTML = `
            <tr class="bg-[#e1f0e8]">
                <th class="border border-gray-300 px-2 py-1">Data</th>
                <th class="border border-gray-300 px-2 py-1">Orario</th>
                <th class="border border-gray-300 px-2 py-1">Disponibilità</th>
            </tr>`;
        offer.disponibilità.forEach(d => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="border border-gray-300 px-2 py-1">${d.data}</td>
                <td class="border border-gray-300 px-2 py-1">${d.orario}</td>
                <td class="border border-gray-300 px-2 py-1">${d.posti} postazioni</td>`;
            tbody.appendChild(tr);
        });
    } else if (offer.tipo === "Settimanale") {
        thead.innerHTML = `
            <tr class="bg-[#e1f0e8]">
                <th class="border border-gray-300 px-2 py-1">Data Inizio</th>
                <th class="border border-gray-300 px-2 py-1">Data Fine</th>
                <th class="border border-gray-300 px-2 py-1">Disponibilità</th>
            </tr>`;
        offer.disponibilità.forEach(d => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="border border-gray-300 px-2 py-1">${d.data_inizio}</td>
                <td class="border border-gray-300 px-2 py-1">${d.data_fine}</td>
                <td class="border border-gray-300 px-2 py-1">${d.posti} postazioni</td>`;
            tbody.appendChild(tr);
        });
    } else if (offer.tipo === "Mensile") {
        thead.innerHTML = `
            <tr class="bg-[#e1f0e8]">
                <th class="border border-gray-300 px-2 py-1">Mese</th>
                <th class="border border-gray-300 px-2 py-1">Disponibilità</th>
            </tr>`;
        offer.disponibilità.forEach(d => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="border border-gray-300 px-2 py-1">${d.mese}</td>
                <td class="border border-gray-300 px-2 py-1">${d.posti} postazioni</td>`;
            tbody.appendChild(tr);
        });
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

// Popolamento dinamico
const container = document.getElementById("offers-container");
offersData.forEach(offer => {
    let card = document.createElement("div");
    card.className = "offer-card relative bg-[#f3f6f4] rounded-lg p-6 border border-[#2b2926]";
    card.innerHTML = `
        <h3 class="text-[#2b2926] text-xl font-bold mb-4">${offer.tipo}</h3>
        <p class="text-[#2b2926] mb-6">${offer.descrizione}</p>
        <div class="flex items-center gap-2 mb-6">
            <span class="text-[#2b2926] text-2xl font-bold">€ ${offer.prezzo}</span>
            <span class="text-[#2b2926]">al ${offer.unità} + IVA</span>
        </div>`;

    card.appendChild(createTable(offer));

    let btn = document.createElement("a");
    btn.href = `checkout.html?tipo=${offer.tipo.toLowerCase()}`;
    btn.className = "bg-[#4a3729] hover:bg-[#2ec46d] text-[#f3f6f4] font-bold py-2 px-4 rounded";
    btn.textContent = "Prenota";

    card.appendChild(btn);
    container.appendChild(card);
});