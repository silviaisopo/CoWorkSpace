document.addEventListener('DOMContentLoaded', function() {
    // Recupera il tipo di abbonamento dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipoAbbonamento = urlParams.get('tipo');

    // Imposta il titolo e i dettagli in base al tipo
    if(tipoAbbonamento) {
        const titolo = document.getElementById('titolo-abbonamento');
        const dettagli = document.getElementById('dettagli-abbonamento');
        const prezzo = document.getElementById('prezzo-abbonamento');

        switch(tipoAbbonamento) {
            case 'giornaliero':
                titolo.textContent = 'Abbonamento Giornaliero';
                dettagli.innerHTML = `
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Accesso 24/7
                            </li>
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Wi-Fi ad alta velocità
                            </li>
                            <li class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Caffè e snack inclusi
                            </li>
                        `;
                prezzo.textContent = '€ 25/giorno + IVA';
                break;
            case 'settimanale':
                titolo.textContent = 'Abbonamento Settimanale';
                dettagli.innerHTML = `
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Tutti i vantaggi del giornaliero
                            </li>
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Sconto del 15%
                            </li>
                            <li class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Postazione garantita
                            </li>
                        `;
                prezzo.textContent = '€ 110/settimana + IVA';
                break;
            case 'mensile':
                titolo.textContent = 'Abbonamento Mensile';
                dettagli.innerHTML = `
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Tutti i vantaggi del settimanale
                            </li>
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Sconto del 17%
                            </li>
                            <li class="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Scrivanìa dedicata
                            </li>
                            <li class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#38e07b" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                Armadietto personale
                            </li>
                        `;
                prezzo.textContent = '€ 250/mese + IVA';
                break;
        }
    }
});