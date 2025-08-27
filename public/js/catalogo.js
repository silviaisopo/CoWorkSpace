document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    // --- Legge parametro search dalla URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search'); // corrisponde a index.js

    if (searchTerm) {
        const cittaInput = document.getElementById('citta');
        if (cittaInput) {
            cittaInput.value = decodeURIComponent(searchTerm);
        }
    }

    applyFilters();
});

// --- Applica filtri ai risultati ---
function applyFilters() {
    const tipo = document.getElementById('tipo')?.value || '';
    const citta = document.getElementById('citta')?.value || '';
    const strumento = document.getElementById('strumento')?.value || '';

    const mockResults = [
        {
            id: 1,
            title: "Ufficio Privato Milano",
            description: "Ufficio privato nel centro di Milano con tutti i comfort",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSFVJXKFMKPF4Y9Ap8zeXXfQN86oVaVzABorVtbp9Mzc8qQfNPCSd2wdq3pweCPJgcwHZ0OOcA7KB0wf85kJ5yc_o0qU4dIn14MgmvD387necQBeVpHwpdb2HF82GyIrl6hUPfnqzGb44q8jDIDctgWWsCwt9rZXzbG8IWev4J__luX__ENLVomEFymxp4k5PkgYXlVGhb-cw5YcdRcl1VRPTLqACdRsjEVGgt07miicPnyTXTzAUIII9978eyEaPZLrpscovMPAbR",
            type: "Ufficio",
            city: "Milano",
            tools: ["Wi-Fi", "Sala riunioni", "Stampante"]
        },
        {
            id: 2,
            title: "Sala Riunioni Roma",
            description: "Spazio professionale per meeting a Roma centro",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeRomP7UqpNgJ9xztmzJWn8Px-dGIkDG_A_i4QBFv3lt_AZFPwgC7dlE11A-gwS6tOV88SRq188mitNLzRg3m2st0Hy5MVuKY-nO-nDaqNOts-JAuvXEPsaB36e4iJX_Yn1a35DdRPGl9aos2iTgam-Te0YEcQOGy7-UNha6sDmVBi2HPKaYMJWZhAmZ-WWkpGiAz3vv72tHTHtotNfAXEZMAcOLVCFpex7-kUvaiCG89KXktaySDY7DWfmFej6WM-zX9gFPEAxU-j",
            type: "Sala riunioni",
            city: "Roma",
            tools: ["Wi-Fi", "Sala riunioni", "Cucina"]
        },
        {
            id: 3,
            title: "Coworking Firenze",
            description: "Spazio condiviso in centro a Firenze con postazioni flessibili",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7q968rq9czVRileVT-3JZak4iUvkMQKh-0rWaA-G0H3f3NTIduudV9krQJBWIiLx65Biqw-Q2u83zrLqq1cuenPEB_QPkcvDybz0CF2vWDrwlbEpXjXtbW0_xaDy4FZA-3rR7rtCXRznTccmUc1UbLSMTw0b_r3fNbpIeAybOqUBMBozirMVQNRlKyvBaj2p9bl_5BElV_q3A-qsnwgsbOPJj2FErrzr5dHzQeSykpn_8JSrF6Uym_pX_HPOy0ahGLMXm9Yvu1RH0",
            type: "Coworking",
            city: "Firenze",
            tools: ["Wi-Fi", "Cucina"]
        }
    ];

    const filteredResults = mockResults.filter(item => {
        return (
            (tipo === '' || item.type === tipo) &&
            (citta === '' || item.city.toLowerCase().includes(citta.toLowerCase())) &&
            (strumento === '' || item.tools.includes(strumento))
        );
    });

    displayResults(filteredResults);
}

// --- Mostra risultati ---
function displayResults(results) {
    const resultsContainer = document.getElementById('risultati');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-white col-span-3 text-center">Nessun risultato trovato</p>';
        return;
    }

    resultsContainer.innerHTML = results.map(item => `
        <div class="bg-[#f3f6f4] border border-[#4a3729] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${item.image}')"></div>
            <div class="p-4">
                <h3 class="text-[#212121] font-bold mb-2">${item.title}</h3>
                <p class="text-[#212121] mb-3">${item.description}</p>
                <div class="flex justify-between items-center">
                    <a href="dettaglio.html?id=${item.id}" class="bg-[#4a3729] text-[#f3f6f4] font-bold px-4 py-1 rounded-lg">Dettagli</a>
                </div>
            </div>
        </div>
    `).join('');
}
