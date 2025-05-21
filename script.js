let formData = {}; // Variável global para armazenar os dados do formulário

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





// Função para gerar a pré-visualização
function generatePreview() {
    const patientNameInput = document.getElementById('patientName');
    const patientName = patientNameInput ? patientNameInput.value : '';

    const dateDisplayElement = document.getElementById('dateDisplay');
    const dateDisplayContent = dateDisplayElement ? dateDisplayElement.textContent : '';

    const medicinesDiv = document.getElementById('medicines');
    const previewDiv = document.getElementById('preview');
    const previewActions = document.getElementById('previewActions');

    // Armazenar dados do formulário em formData
    // Adicione outros campos do formulário aqui se existirem (ex: patientAge, address, etc.)
    formData = {
        patientName: patientName,
        dateDisplay: dateDisplayContent,
        medicines: []
    };

    // Objeto para agrupar medicamentos por via de administração
    const groupedMedicines = {};
    // Array para manter a ordem de aparição das vias
    const routeOrder = [];

    // Coletar e agrupar os medicamentos
    medicinesDiv.querySelectorAll('.medicine').forEach((medicine, index) => {
        const routeElement = medicine.querySelector('.route');
        const medicineNameElement = medicine.querySelector('input[id^="medicine"]');
        const posologyElement = medicine.querySelector('input[id^="posology"]');
        const quantityElement = medicine.querySelector('input[id^="quantity"]');
        const usageElement = medicine.querySelector('input[id^="usage"]');

        const route = routeElement ? routeElement.value : 'Oral';
        const medicineName = medicineNameElement ? medicineNameElement.value : '';
        const posology = posologyElement ? posologyElement.value : '';
        const quantity = quantityElement ? quantityElement.value : '';
        const usage = usageElement ? usageElement.value : '';

        if (!groupedMedicines[route]) {
            groupedMedicines[route] = [];
            routeOrder.push(route); // Adiciona a via à lista de ordem na primeira vez que aparece            
        }

        const medicineData = {
            originalOrderIndex: index, // Para ordenar dentro da via, se necessário
            name: medicineName,
            posology: posology,
            quantity: quantity,
            usage: usage
        };
        groupedMedicines[route].push(medicineData);

        // Adicionar ao formData
        formData.medicines.push({
            route: route,
            name: medicineName,
            posology: posology,            
            quantity: quantity,
            usage: usage
        });
    });

    // Construir o HTML da pré-visualização
    let medicinesHTML = '';
    let sequentialCounter = 0; // Contador para a numeração sequencial

    // Opcional: garantir que os medicamentos dentro de cada via estejam na ordem original de entrada
    for (const routeKey in groupedMedicines) {
        groupedMedicines[routeKey].sort((a, b) => a.originalOrderIndex - b.originalOrderIndex);
    }

    routeOrder.forEach(route => {
        const medicinesInRoute = groupedMedicines[route];
        if (medicinesInRoute && medicinesInRoute.length > 0) {
            medicinesHTML += `<h3 style="text-align: center; font-size: 14px; margin-top: 20px;">Uso ${route}</h3>`;
            medicinesInRoute.forEach((medicine) => {
                sequentialCounter++; // Incrementar para cada medicamento listado
                medicinesHTML += ` 
                    <p style="text-align: left; font-size: 12px; margin-top: 10px;"><strong>${sequentialCounter}. ${medicine.name} ${medicine.posology} -------------- ${medicine.quantity}</strong></p>
                    <p style="text-align: left; font-size: 12px; margin-left: 20px;">• ${medicine.usage}</p>
                `;
            });
        }
});

    // Adiciona a data, se existir
    const dateHTML = formData.dateDisplay ? `<p style="text-align: left; font-size: 10px; margin-top: 20px;">Data: ${formData.dateDisplay}</p>` : '';

    // Adiciona a linha e a descrição "MÉDICO/CRM"
    const footerHTML = `
        <div style="text-align: center; margin-top: 30px">
        <hr style="border-top: 1px solid #000; width: 25%; margin: 10px auto;">
        <p style="font-size: 12px; margin-top: -5px;">MÉDICO / CRM</p> <!-- Ajuste a margem superior para diminuir o espaço -->
    </div>    
    `;

    if (previewDiv) {
        previewDiv.innerHTML = `
        <img src="images/LogoEbserhTrans.png" alt="Logo UFG" class="logo">
        <h2>RECEITUÁRIO</h2>
        <div class="line"></div>
        <p style="text-align: left; font-size: 14px; margin-top: 20px;">PARA: <strong>${formData.patientName}</strong></p>
        ${medicinesHTML}
        ${dateHTML}
        ${footerHTML} <!-- A linha e "MÉDICO/CRM" são adicionados aqui -->
        <div class="footer">
            <p>1ª AVENIDA - S/Nº - SETOR UNIVERSITÁRIO <br> FONE (62) 3269-8200 - GOIÂNIA/GO</p>
        </div>
    `;
        previewDiv.classList.add('visible');
    }
    if (previewActions) {
        previewActions.classList.remove('hidden');
    }
}

// Modificação em editPrescription para restaurar medicamentos
function editPrescription() {
    const previewElement = document.getElementById('preview');
    const previewActionsElement = document.getElementById('previewActions');

    if (previewElement) previewElement.classList.remove('visible');
    if (previewActionsElement) previewActionsElement.classList.add('hidden');

    // Restaurar dados principais do formulário
    const patientNameInput = document.getElementById('patientName');
    if (patientNameInput && formData.patientName !== undefined) patientNameInput.value = formData.patientName;
    // Restaure outros campos principais aqui, se existirem, usando formData
    // Ex: document.getElementById('patientAge').value = formData.patientAge || '';

    // Restaurar a data
    const dateDisplayElement = document.getElementById('dateDisplay');
    const currentDateParagraph = document.getElementById('currentDate');
    if (formData.dateDisplay) {
        if (dateDisplayElement) dateDisplayElement.textContent = formData.dateDisplay;
        if (currentDateParagraph) currentDateParagraph.style.display = 'block';
    } else {
        removeDate(); // Limpa a data se não houver nenhuma salva
    }

    // Restaurar medicamentos
    const medicinesDiv = document.getElementById('medicines');
    if (medicinesDiv) {
        // Limpar medicamentos existentes no formulário (apenas os .medicine)
        const existingMedicineElements = medicinesDiv.querySelectorAll('.medicine');
        existingMedicineElements.forEach(el => el.remove());

        let medicineCountForId = 0;
        if (formData.medicines && formData.medicines.length > 0) {
            formData.medicines.forEach(medData => {
                medicineCountForId++;
                const newMedicine = document.createElement('div');
                newMedicine.className = 'medicine';
                // Recriar a estrutura HTML do medicamento como em addMedicine
                // Usar medicineCountForId para os IDs
                newMedicine.innerHTML = `
                    <div class="top-row">
                        <div class="field">
                            <label for="route${medicineCountForId}">Via:</label>
                            <select id="route${medicineCountForId}" class="route"></select>
                        </div>
                        <div class="field">
                            <label for="medicine${medicineCountForId}">Item:</label>
                            <input type="text" id="medicine${medicineCountForId}" required>
                        </div>
                        <div class="field">
                            <label for="posology${medicineCountForId}">Posologia:</label>
                            <input type="text" id="posology${medicineCountForId}" required>
                        </div>
                        <div class="field">
                            <label for="quantity${medicineCountForId}">Qnt:</label>
                            <input type="text" id="quantity${medicineCountForId}" required>
                        </div>
                    </div>
                    <div class="bottom-row">
                        <div class="field full-width">
                            <label for="usage${medicineCountForId}">Forma de Utilização:</label>
                            <input type="text" id="usage${medicineCountForId}" required>
                        </div>
                        <button type="button" class="remove-medicine" onclick="removeMedicine(this)">&#10060;</button>
                    </div>
                `;
                
                // Preencher as opções do select de via e selecionar a correta
                const routeSelect = newMedicine.querySelector('.route');
                const routeOptions = ["Oral", "Epidural", "Endovenoso", "Inalatório", "Intra-arterial", "Intradérmico", "Intramuscular", "Intraperitoneal", "Intratecal", "Nasal", "Oftalmológico", "Otológico", "Retal", "Subcutâneo", "Sublingual", "Tópico", "Vaginal"];
                routeOptions.forEach(optVal => {
                    const option = document.createElement('option');
                    option.value = optVal;
                    option.textContent = optVal;
                    if (optVal === medData.route) {
                        option.selected = true;
                    }
                    routeSelect.appendChild(option);
                });

                // Preencher os outros campos
                newMedicine.querySelector(`#medicine${medicineCountForId}`).value = medData.name;
                newMedicine.querySelector(`#posology${medicineCountForId}`).value = medData.posology;
                newMedicine.querySelector(`#quantity${medicineCountForId}`).value = medData.quantity;
                newMedicine.querySelector(`#usage${medicineCountForId}`).value = medData.usage;

                // Inserir o medicamento restaurado antes do campo de data
                const dateFieldElement = medicinesDiv.querySelector('.date-field');
                if (dateFieldElement) {
                    medicinesDiv.insertBefore(newMedicine, dateFieldElement);
                } else {
                    medicinesDiv.appendChild(newMedicine); // Fallback
                }
            });
        }
    }
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
// Esta função será chamada após a impressão para reatribuir listeners e restaurar o estado.
function restoreEventListeners() {
    // Reanexar listeners aos botões principais do formulário
    // Certifique-se de que os IDs abaixo correspondem aos IDs no seu HTML
    const addMedicineBtn = document.getElementById('addMedicineBtn'); // Assumindo que o botão "Adicionar Medicamento" tem este ID
    if (addMedicineBtn) addMedicineBtn.addEventListener('click', addMedicine);

    const addDateBtn = document.getElementById('addDateBtn'); // Assumindo que o botão "Adicionar Data Atual" tem este ID
    if (addDateBtn) addDateBtn.addEventListener('click', addCurrentDate);

    const generatePreviewBtn = document.getElementById('generatePreviewBtn'); // Assumindo que o botão "Gerar Pré-visualização" tem este ID
    if (generatePreviewBtn) generatePreviewBtn.addEventListener('click', generatePreview);

    // Reanexar listeners aos botões de ação da pré-visualização
    const editBtn = document.getElementById('editBtn'); // Assumindo que o botão "Editar" na pré-visualização tem este ID
    if (editBtn) editBtn.addEventListener('click', editPrescription);

    const printBtn = document.getElementById('printBtn'); // Assumindo que o botão "Imprimir" na pré-visualização tem este ID
    if (printBtn) printBtn.addEventListener('click', printPrescription);

    // Repopular o formulário e garantir que ele esteja no estado de edição
    // A função editPrescription já lida com o preenchimento dos campos
    // e com a exibição correta do formulário vs pré-visualização.
    // Ela também recria os medicamentos com seus botões de remover.
    editPrescription();
}
