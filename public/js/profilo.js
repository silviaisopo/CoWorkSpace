// Gestione modale
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    modal.classList.remove('hidden');

    if(type === 'email') {
        modalTitle.textContent = 'Modifica Email';
        modalContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Nuova Email</label>
                        <input type="email" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="nuova@email.com">
                    </div>
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Conferma Email</label>
                        <input type="email" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="conferma@email.com">
                    </div>
                </div>
            `;
    } else if(type === 'password') {
        modalTitle.textContent = 'Modifica Password';
        modalContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Password Attuale</label>
                        <input type="password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                    </div>
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Nuova Password</label>
                        <input type="password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                    </div>
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Conferma Password</label>
                        <input type="password" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2">
                    </div>
                </div>
            `;
    } else if(type === 'phone') {
        modalTitle.textContent = 'Modifica Telefono';
        modalContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="text-[#96c5a9] text-sm mb-1 block">Nuovo Numero</label>
                        <input type="tel" class="w-full bg-[#264532] border border-[#366348] text-white rounded-lg px-4 py-2" placeholder="+39 123 456 7890">
                    </div>
                </div>
            `;
    }
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function saveChanges() {
    // Logica per salvare le modifiche
    alert("Modifiche salvate con successo!");
    closeModal();
}

function saveProfile() {
    // Logica per salvare il profilo
    alert("Profilo aggiornato con successo!");
}

function logout() {
    // Logica di logout
    alert("Logout effettuato con successo!");
    window.location.href = "index.html";
}