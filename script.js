function editPrescription() {
    document.getElementById('preview').classList.remove('visible');
    document.getElementById('previewActions').classList.add('hidden');

    // Certifique-se de que a data seja redefinida corretamente
    removeDate();
}


function removeDate() {
    const dateDisplay = document.getElementById('dateDisplay');
    const currentDateParagraph = document.getElementById('currentDate');

    if (dateDisplay) {
        dateDisplay.textContent = ''; // Limpa o conteúdo da data
    }

    if (currentDateParagraph) {
        currentDateParagraph.style.display = 'none'; // Oculta o parágrafo da data
    }
}


function addCurrentDate() {
    const currentDate = new Date(); // Obtém a data atual
    const dateDisplay = document.getElementById('dateDisplay');
    const currentDateParagraph = document.getElementById('currentDate');

    // Formata a data no formato "DD/MM/AAAA"
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Exibe a data no campo
    dateDisplay.textContent = formattedDate;
    currentDateParagraph.style.display = 'block'; // Torna o parágrafo visível
}

function addMedicine() {
    const medicinesDiv = document.getElementById('medicines');
    const medicineCount = medicinesDiv.children.length + 1;

    // Criar novo medicamento
    const newMedicine = document.createElement('div');
    newMedicine.className = 'medicine';
    newMedicine.innerHTML = `
        <div class="top-row">
            <div class="field">
                <label for="route${medicineCount}">Via:</label>
                <select id="route${medicineCount}" class="route">
                    <option value="Oral" selected>Oral</option>
                    <option value="Epidural">Epidural</option>
                    <option value="Endovenoso">Endovenoso</option>
                    <option value="Inalatório">Inalatório</option>
                    <option value="Intra-arterial">Intra-arterial</option>
                    <option value="Intradérmico">Intradérmico</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Intraperitoneal">Intraperitoneal</option>
                    <option value="Intratecal">Intratecal</option>
                    <option value="Nasal">Nasal</option>
                    <option value="Oftalmológico">Oftalmológico</option>
                    <option value="Otológico">Otológico</option>
                    <option value="Retal">Retal</option>
                    <option value="Subcutâneo">Subcutâneo</option>
                    <option value="Sublingual">Sublingual</option>
                    <option value="Tópico">Tópico</option>
                    <option value="Vaginal">Vaginal</option>
                </select>
            </div>

            <div class="field">
                <label for="medicine${medicineCount}">Item:</label>
                <input type="text" id="medicine${medicineCount}" required>
            </div>

            <div class="field">
                <label for="posology${medicineCount}">Posologia:</label>
                <input type="text" id="posology${medicineCount}" required>
            </div>

            <div class="field">
                <label for="quantity${medicineCount}">Qnt:</label>
                <input type="text" id="quantity${medicineCount}" required>
            </div>
        </div>

        <div class="bottom-row">
            <div class="field full-width">
                <label for="usage${medicineCount}">Forma de Utilização:</label>
                <input type="text" id="usage${medicineCount}" required>
            </div>
            <button type="button" class="remove-medicine" onclick="removeMedicine(this)">&#10060;</button>
        </div>
    `;

    // Inserir o novo medicamento no início da lista de medicamentos
    medicinesDiv.insertBefore(newMedicine, document.querySelector('.date-field'));

    // Garantir que a geração de pré-visualização continue funcionando
    generatePreview();
}

// Função para remover um medicamento
function removeMedicine(button) {
    button.closest('.medicine').remove();
    generatePreview(); // Atualizar a pré-visualização após remoção
}


// Função para remover o item específico
function removeMedicine(button) {
    const medicineDiv = button.closest('.medicine'); // Obtém o <div class="medicine"> que contém todo o item
    medicineDiv.remove(); // Remove o elemento inteiro
}



// Função para gerar a pré-visualização
function generatePreview() {
    const patientName = document.getElementById('patientName').value;
    const medicinesDiv = document.getElementById('medicines');
    const previewDiv = document.getElementById('preview');
    const previewActions = document.getElementById('previewActions');
    const dateDisplay = document.getElementById('dateDisplay').textContent;

    // Objeto para agrupar medicamentos por via de administração
    const groupedMedicines = {};

    // Coletar e agrupar os medicamentos
    medicinesDiv.querySelectorAll('.medicine').forEach((medicine, index) => {
        const route = medicine.querySelector('.route').value;
        const medicineName = medicine.querySelector('input[id^="medicine"]').value;
        const posology = medicine.querySelector('input[id^="posology"]').value;
        const quantity = medicine.querySelector('input[id^="quantity"]').value;
        const usage = medicine.querySelector('input[id^="usage"]').value;

        if (!groupedMedicines[route]) {
            groupedMedicines[route] = [];
        }

        groupedMedicines[route].push({
            index: index + 1,
            name: medicineName,
            posology: posology,
            quantity: quantity,
            usage: usage
        });
    });

    // Construir o HTML da pré-visualização
    let medicinesHTML = '';
    for (const [route, medicines] of Object.entries(groupedMedicines)) {
        medicinesHTML += `<h3 style="text-align: center; font-size: 14px; margin-top: 20px;">Uso ${route}</h3>`;
        medicines.forEach((medicine) => {
            medicinesHTML += ` 
                <p style="text-align: left; font-size: 12px; margin-top: 10px;"><strong>${medicine.index}. ${medicine.name} ${medicine.posology} -------------- ${medicine.quantity}</strong></p>
                <p style="text-align: left; font-size: 12px; margin-left: 20px;">• ${medicine.usage}</p>
            `;
        });
    }

    // Adiciona a data, se existir
    const dateHTML = dateDisplay ? `<p style="text-align: left; font-size: 10px; margin-top: 20px;">Data: ${dateDisplay}</p>` : '';

    // Adiciona a linha e a descrição "MÉDICO/CRM"
    const footerHTML = `
        <div style="text-align: center; margin-top: 30px">
        <hr style="border-top: 1px solid #000; width: 25%; margin: 10px auto;">
        <p style="font-size: 12px; margin-top: -5px;">MÉDICO / CRM</p> <!-- Ajuste a margem superior para diminuir o espaço -->
    </div>
    `;

    previewDiv.innerHTML = `
        <img src="https://i.imgur.com/PSEI5W9.png" alt="Logo UFG" class="logo">
        <h2>RECEITUÁRIO</h2>
        <div class="line"></div>
        <p style="text-align: left; font-size: 14px; margin-top: 20px;">PARA: <strong>${patientName}</strong></p>
        ${medicinesHTML}
        ${dateHTML}
        ${footerHTML} <!-- A linha e "MÉDICO/CRM" são adicionados aqui -->
        <div class="footer">
            <p>1ª AVENIDA - S/Nº - SETOR UNIVERSITÁRIO <br> FONE (62) 3269-8200 - GOIÂNIA/GO</p>
        </div>
    `;

    previewDiv.classList.add('visible');
    previewActions.classList.remove('hidden');
}



function editPrescription() {
    document.getElementById('preview').classList.remove('visible');
    document.getElementById('previewActions').classList.add('hidden');
}


function printPrescription() {
    const previewDiv = document.getElementById('preview');

    // Salvar o conteúdo original da página
    const originalContent = document.body.innerHTML;

    // Criar um contêiner exclusivo para a impressão
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';

    // Clonar o conteúdo do receituário duas vezes
    const copy1 = previewDiv.cloneNode(true);
    const copy2 = previewDiv.cloneNode(true);

    copy1.classList.add('prescription-copy');
    copy2.classList.add('prescription-copy');

    // Adicionar as cópias ao contêiner
    printContainer.appendChild(copy1);
    printContainer.appendChild(copy2);

    // Substituir apenas o conteúdo visível para impressão
    document.body.innerHTML = '';
    document.body.appendChild(printContainer);

    // Tentar imprimir e restaurar a interface original depois
    window.print();

    // Restaurar o conteúdo original sem recarregar a página
    document.body.innerHTML = originalContent;

    // Reexecutar scripts e eventos necessários (se houver)
    restoreEventListeners();
}

// Função para restaurar event listeners caso necessário
function restoreEventListeners() {
    // Se você tinha eventos em botões ou formulários, precisa reanexá-los aqui
    document.getElementById('meuBotao').addEventListener('click', minhaFuncao);
}
