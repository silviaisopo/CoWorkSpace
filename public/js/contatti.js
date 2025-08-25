document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assistenzaForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Previeni l'invio tradizionale del form

        // Crea il messaggio di conferma
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#4a3729] text-[#f3f6f4] px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in-up';
        confirmationMessage.textContent = 'Modulo inviato, riceverà assistenza al più presto';

        // Aggiungi il messaggio in fondo alla pagina
        document.body.appendChild(confirmationMessage);

        // Simula l'invio del form (nella realtà qui faresti una chiamata AJAX)
        console.log('Form inviato:', {
            nome: form.nome.value,
            email: form.email.value,
            messaggio: form.messaggio.value
        });

        // Resetta il form
        form.reset();

        // Rimuovi il messaggio dopo 5 secondi
        setTimeout(() => {
            confirmationMessage.classList.add('animate-fade-out');
            setTimeout(() => {
                confirmationMessage.remove();
            }, 300);
        }, 5000);
    });
});