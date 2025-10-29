document.addEventListener('DOMContentLoaded', () => {
    
    // Seletores dos elementos principais
    const medList = document.getElementById('medication-list');
    const template = document.getElementById('medication-template');
    const addItemBtn = document.getElementById('add-item-btn');
    const addDateBtn = document.getElementById('add-date-btn');
    const generateBtn = document.getElementById('generate-doc-btn');

    // Variável para controlar o estado do botão "Datar" (ON/OFF)
    let isDateEnabled = false;

    // Função para adicionar um novo item
    function addNewItem() {
        const clone = template.content.cloneNode(true);
        const medItem = clone.querySelector('.medication-item');
        
        // Adiciona o evento de remoção ao botão 'X' do novo item
        const removeBtn = medItem.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', () => {
            medItem.remove();
        });
        
        medList.appendChild(medItem);
    }

    // Função para datar o documento
    function setDate() {
        const today = new Date();
        // Formata a data (ex: Goiânia, 28 de Outubro de 2025)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('pt-BR', options);
        
        // Adiciona a data no campo de impressão (escondido)
        const dateField = document.getElementById('print-date');
        // Você pode ajustar o local (Goiânia) conforme necessário
        dateField.textContent = `Goiânia/GO, ${formattedDate}`; 
    }

    // Função principal: Gerar o documento
    function generateDocument() {
        // 1. Coletar dados do paciente e data
        const patientName = document.getElementById('patient-name').value;
        document.getElementById('print-patient-name').textContent = patientName;

        // Verifica se o botão "Datar" está ativo.
        // Se estiver, chama a função setDate(). Se não, limpa o campo da data.
        if (isDateEnabled) {
            setDate();
        } else {
            const dateField = document.getElementById('print-date');
            if (dateField) {
                dateField.textContent = '';
            }
        }
        
        // 2. Coletar dados dos medicamentos
        const items = [];
        const medItems = medList.querySelectorAll('.medication-item');
        
        medItems.forEach(item => {
            items.push({
                via: item.querySelector('.med-via').value,
                item: item.querySelector('.med-item').value,
                posologia: item.querySelector('.med-posology').value,
                qnt: item.querySelector('.med-quantity').value,
                uso: item.querySelector('.med-usage').value
            });
        });

        // 3. Agrupar medicamentos por 'via'
        // Usamos um Map para agrupar, o que preserva a ordem de inserção
        const grouped = new Map();
        items.forEach(item => {
            if (!grouped.has(item.via)) {
                grouped.set(item.via, []);
            }
            grouped.get(item.via).push(item);
        });

        // 4. Construir o HTML para a lista de impressão
        const printList = document.getElementById('print-med-list');
        printList.innerHTML = ''; // Limpa a lista anterior

        // Usamos um contador manual para garantir a numeração contínua
        let medCounter = 1;

        grouped.forEach((meds, via) => {
            // Adiciona o título da via
            const viaTitle = document.createElement('div');
            viaTitle.className = 'print-via-title';
            viaTitle.textContent = `USO ${via}`; // Ex: "Uso Oral"
            printList.appendChild(viaTitle);

            // Adiciona os medicamentos desse grupo
            meds.forEach(med => {
                const medLi = document.createElement('li');
                // Adiciona o número manualmente usando um pseudo-elemento ::before que será estilizado no CSS
                medLi.setAttribute('data-counter', medCounter++);
                
                // Monta a parte principal do medicamento, tratando a posologia opcional
                const medMainText = [med.item || 'N/A', med.posologia].filter(Boolean).join(' ');

                // Nova estrutura para alinhamento com preenchimento
                const medContent = document.createElement('div');
                medContent.className = 'med-line';
                medContent.innerHTML = `<span class="med-main">${medMainText}</span><span class="med-filler"></span><span class="med-quantity">${med.qnt || 'N/A'}</span>`;
                medLi.appendChild(medContent);
                
                // Adiciona a forma de utilização (se houver)
                if (med.uso) {
                    const usageDiv = document.createElement('div');
                    usageDiv.className = 'usage-details';
                    usageDiv.textContent = `${med.uso}`;
                    medLi.appendChild(usageDiv);
                }
                
                printList.appendChild(medLi);
            });
        });
        
        // 5. Abrir uma nova janela para impressão para não perder os dados do formulário
        // Garante que #print-output esteja visível no DOM principal para que seu innerHTML seja capturado corretamente.
        // O style.css o esconde por padrão.
        const printOutputElement = document.getElementById('print-output');
        printOutputElement.style.display = 'block';

        const printWindow = window.open('', '_blank');
        

        if (!printWindow) {
            printOutputElement.style.display = 'none'; // Esconde de volta se a janela falhar
            alert('A impressão foi bloqueada pelo navegador. Por favor, habilite os pop-ups para este site.');
            return;
        }

        // 6. Montar o HTML completo para a nova janela
        const printContent = printOutputElement.innerHTML;
        printOutputElement.style.display = 'none'; // Esconde de volta após capturar o conteúdo

        const printCSS = document.querySelector('link[href="print.css"]').outerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Receituário para Impressão</title>
                ${printCSS}
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);

        printWindow.document.close();

        // 7. Acionar a impressão após o conteúdo carregar
        printWindow.addEventListener('load', () => {
            printWindow.print();
            printWindow.close();
        });
    }

    // Função para alternar o estado da data (ON/OFF)
    function toggleDate() {
        isDateEnabled = !isDateEnabled; // Inverte o estado (true -> false, false -> true)
        addDateBtn.classList.toggle('active'); // Adiciona/remove a classe 'active' para feedback visual
    }

    // Adiciona os ouvintes de eventos
    addItemBtn.addEventListener('click', addNewItem);
    addDateBtn.addEventListener('click', toggleDate); // O botão agora chama a função de alternância
    generateBtn.addEventListener('click', generateDocument);

    // Adiciona um item inicial ao carregar a página
    addNewItem();
});