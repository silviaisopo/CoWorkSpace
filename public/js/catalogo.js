// Database degli spazi disponibili (in un'app reale questi dati verrebbero da un'API)
const spaziDisponibili = [
    {
        id: 1,
        titolo: "Ufficio Privato Centro",
        tipo: "Ufficio",
        citta: "Milano",
        prezzo: 450,
        strumenti: ["Wi-Fi", "Stampante", "Cucina"],
        descrizione: "Ufficio privato nel cuore di Milano, ideale per professionisti che cercano tranquillità.",
        immagine: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        titolo: "Postazione Coworking",
        tipo: "Coworking",
        citta: "Roma",
        prezzo: 200,
        strumenti: ["Wi-Fi", "Sala riunioni"],
        descrizione: "Postazione in spazio coworking vivace e stimolante, perfetta per networking.",
        immagine: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        titolo: "Studio Creativo",
        tipo: "Studio",
        citta: "Firenze",
        prezzo: 350,
        strumenti: ["Wi-Fi", "Stampante"],
        descrizione: "Studio luminoso e spazioso, adatto a creativi e designer.",
        immagine: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        titolo: "Ufficio Executive",
        tipo: "Ufficio",
        citta: "Milano",
        prezzo: 600,
        strumenti: ["Wi-Fi", "Sala riunioni", "Cucina"],
        descrizione: "Ufficio di prestigio con arredi di alta qualità e servizi premium.",
        immagine: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        titolo: "Spazio Coworking Verde",
        tipo: "Coworking",
        citta: "Torino",
        prezzo: 180,
        strumenti: ["Wi-Fi", "Cucina"],
        descrizione: "Coworking eco-friendly con aree verdi e atmosfera rilassata.",
        immagine: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        titolo: "Mini Studio",
        tipo: "Studio",
        citta: "Bologna",
        prezzo: 280,
        strumenti: ["Wi-Fi"],
        descrizione: "Studio compatto ma funzionale, perfetto per lavoratori autonomi.",
        immagine: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// Funzione per filtrare gli spazi in base ai criteri di ricerca
function filtraSpazi() {
    // Recupera i valori dai campi di ricerca
    const tipo = document.getElementById('tipo').value.toLowerCase();
    const citta = document.getElementById('citta').value.toLowerCase();
    const prezzoMin = parseFloat(document.getElementById('prezzoMin').value) || 0;
    const prezzoMax = parseFloat(document.getElementById('prezzoMax').value) || Infinity;
    const strumento = document.getElementById('strumento').value;

    // Filtra gli spazi
    const spaziFiltrati = spaziDisponibili.filter(spazio => {
        // Filtro per tipo
        if (tipo && spazio.tipo.toLowerCase() !== tipo) return false;

        // Filtro per città
        if (citta && !spazio.citta.toLowerCase().includes(citta)) return false;

        // Filtro per prezzo
        if (spazio.prezzo < prezzoMin || spazio.prezzo > prezzoMax) return false;

        // Filtro per strumenti
        if (strumento && !spazio.strumenti.includes(strumento)) return false;

        return true;
    });

    // Mostra i risultati
    mostraRisultati(spaziFiltrati);
}

// Funzione per mostrare i risultati nella pagina
function mostraRisultati(spazi) {
    const risultatiContainer = document.getElementById('risultati');

    if (spazi.length === 0) {
        risultatiContainer.innerHTML = '<p class="text-center col-span-3 py-10">Nessun risultato trovato. Prova a modificare i filtri di ricerca.</p>';
        return;
    }

    risultatiContainer.innerHTML = spazi.map(spazio => `
        <div class="bg-[#1b3124] border border-[#366348] rounded-lg overflow-hidden">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${spazio.immagine}')"></div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold">${spazio.titolo}</h3>
                    <span class="bg-[#366348] text-[#96c5a9] text-xs px-2 py-1 rounded">${spazio.tipo}</span>
                </div>
                <p class="text-[#96c5a9] text-sm mb-4">${spazio.citta}</p>
                <p class="text-sm mb-4">${spazio.descrizione}</p>
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-2xl font-bold">€${spazio.prezzo}</span>
                        <span class="text-[#96c5a9] text-sm">/mese</span>
                    </div>
                    <button class="bg-[#38e07b] text-[#122118] font-bold px-4 py-1 rounded text-sm">
                        Prenota
                    </button>
                </div>
                <div class="mt-4 pt-4 border-t border-[#366348]">
                    <p class="text-[#96c5a9] text-xs mb-2">Servizi inclusi:</p>
                    <div class="flex flex-wrap gap-2">
                        ${spazio.strumenti.map(strumento =>
        `<span class="bg-[#264532] text-white text-xs px-2 py-1 rounded">${strumento}</span>`
    ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Gestione dell'evento di submit del form
document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    filtraSpazi();
});

// Mostra tutti gli spazi al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    mostraRisultati(spaziDisponibili);
});