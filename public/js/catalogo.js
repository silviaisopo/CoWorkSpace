// js/catalogo.js
document.addEventListener('DOMContentLoaded', function() {
    // Gestione del form di filtraggio locale
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    // Controlla se c'è un parametro di ricerca nell'URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        // Se c'è un termine di ricerca, impostalo nel campo città e applica il filtro
        const cittaInput = document.getElementById('citta');
        if (cittaInput) {
            cittaInput.value = decodeURIComponent(searchTerm);
        }
        applyFilters();
    } else {
        // Altrimenti mostra tutti i risultati
        applyFilters();
    }
});

function applyFilters() {
    // Prendi i valori dai filtri
    const tipo = document.getElementById('tipo').value;
    const citta = document.getElementById('citta').value;
    const prezzoMin = document.getElementById('prezzoMin').value;
    const prezzoMax = document.getElementById('prezzoMax').value;
    const strumento = document.getElementById('strumento').value;

    // Qui dovresti fare una chiamata API o filtrare i dati locali
    // Per questo esempio mostreremo dei risultati mock
    const mockResults = [
        {
            id: 1,
            title: "Ufficio Privato Milano",
            description: "Ufficio privato nel centro di Milano con tutti i comfort",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSFVJXKFMKPF4Y9Ap8zeXXfQN86oVaVzABorVtbp9Mzc8qQfNPCSd2wdq3pweCPJgcwHZ0OOcA7KB0wf85kJ5yc_o0qU4dIn14MgmvD387necQBeVpHwpdb2HF82GyIrl6hUPfnqzGb44q8jDIDctgWWsCwt9rZXzbG8IWev4J__luX__ENLVomEFymxp4k5PkgYXlVGhb-cw5YcdRcl1VRPTLqACdRsjEVGgt07miicPnyTXTzAUIII9978eyEaPZLrpscovMPAbR",
            type: "Ufficio",
            city: "Milano",
            price: 120,
            tools: ["Wi-Fi", "Sala riunioni", "Stampante"]
        },
        {
            id: 2,
            title: "Sala Riunioni Roma",
            description: "Spazio professionale per meeting a Roma centro",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeRomP7UqpNgJ9xztmzJWn8Px-dGIkDG_A_i4QBFv3lt_AZFPwgC7dlE11A-gwS6tOV88SRq188mitNLzRg3m2st0Hy5MVuKY-nO-nDaqNOts-JAuvXEPsaB36e4iJX_Yn1a35DdRPGl9aos2iTgam-Te0YEcQOGy7-UNha6sDmVBi2HPKaYMJWZhAmZ-WWkpGiAz3vv72tHTHtotNfAXEZMAcOLVCFpex7-kUvaiCG89KXktaySDY7DWfmFej6WM-zX9gFPEAxU-j",
            type: "Sala riunioni",
            city: "Roma",
            price: 90,
            tools: ["Wi-Fi", "Sala riunioni", "Cucina"]
        },
        {
            id: 3,
            title: "Coworking Firenze",
            description: "Spazio condiviso in centro a Firenze con postazioni flessibili",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7q968rq9czVRileVT-3JZak4iUvkMQKh-0rWaA-G0H3f3NTIduudV9krQJBWIiLx65Biqw-Q2u83zrLqq1cuenPEB_QPkcvDybz0CF2vWDrwlbEpXjXtbW0_xaDy4FZA-3rR7rtCXRznTccmUc1UbLSMTw0b_r3fNbpIeAybOqUBMBozirMVQNRlKyvBaj2p9bl_5BElV_q3A-qsnwgsbOPJj2FErrzr5dHzQeSykpn_8JSrF6Uym_pX_HPOy0ahGLMXm9Yvu1RH0",
            type: "Coworking",
            city: "Firenze",
            price: 60,
            tools: ["Wi-Fi", "Cucina"]
        }
    ];

    // Filtra i risultati
    const filteredResults = mockResults.filter(item => {
        return (
            (tipo === '' || item.type === tipo) &&
            (citta === '' || item.city.toLowerCase().includes(citta.toLowerCase())) &&
            (prezzoMin === '' || item.price >= parseInt(prezzoMin)) &&
            (prezzoMax === '' || item.price <= parseInt(prezzoMax)) &&
            (strumento === '' || item.tools.includes(strumento))
        );
    });

    // Mostra i risultati
    displayResults(filteredResults);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('risultati');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-white col-span-3 text-center">Nessun risultato trovato</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(item => `
        <div class="bg-[#1b3124] border border-[#366348] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${item.image}')"></div>
            <div class="p-4">
                <h3 class="text-xl font-bold mb-2">${item.title}</h3>
                <p class="text-[#96c5a9] mb-3">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold">€${item.price}/giorno</span>
                    <a href="dettaglio.html?id=${item.id}" class="bg-[#38e07b] text-[#122118] font-bold px-4 py-1 rounded-lg">Dettagli</a>
                </div>
            </div>
        </div>
    `).join('');
}