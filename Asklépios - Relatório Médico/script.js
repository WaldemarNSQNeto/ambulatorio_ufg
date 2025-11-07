document.addEventListener('DOMContentLoaded', () => {
    
    // Seletores dos elementos principais
    const addDateBtn = document.getElementById('add-date-btn');
    const generateBtn = document.getElementById('generate-doc-btn');
    const resetBtn = document.getElementById('reset-btn');
    const duplicateBtn = document.getElementById('duplicate-btn');
    const patientNameInput = document.getElementById('patient-name');
    const patientIdInput = document.getElementById('patient-id-number');
    const reportTextInput = document.getElementById('medical-report-text');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const ulBtn = document.getElementById('ul-btn');
    const olBtn = document.getElementById('ol-btn');
    const charWarning = document.getElementById('char-limit-warning');

    // Variável para controlar o estado do botão "Datar" (ON/OFF)
    let isDateEnabled = false;

    // Variável para controlar o estado do botão "Duplicar" (ON/OFF)
    let isDuplicateEnabled = false;

    // Função para mostrar aviso de limite de caracteres
    function checkCharLimit() {
        const maxLength = patientNameInput.maxLength;
        const currentLength = patientNameInput.value.length;

        // Mostra o aviso se o limite for atingido, senão o esconde
        charWarning.style.display = (currentLength >= maxLength) ? 'block' : 'none';
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
        const fullDateText = `Goiânia/GO, ${formattedDate}`;
        dateField.textContent = fullDateText.toUpperCase();
    }

    // Função principal: Gerar o documento
    function generateDocument() {
        // 1. Coletar dados do paciente e data
        const patientName = document.getElementById('patient-name').value;
        const patientId = document.getElementById('patient-id-number').value;
        document.getElementById('print-patient-name').textContent = patientName;
        document.getElementById('print-patient-id').textContent = patientId;
        
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
        
        // 2. Coletar o texto do relatório
        const reportHTML = reportTextInput.innerHTML;
        const printReportContent = document.getElementById('print-report-content');
        // O conteúdo já está em HTML, então podemos inseri-lo diretamente
        printReportContent.innerHTML = reportHTML;
        
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

        // Determine a regra @page com base no status de duplicação
        let pageStyle = '';
        if (isDuplicateEnabled) {
            pageStyle = `
                @page {
                    size: A4 landscape;
                    margin: 1cm;
                }
            `;
        } else {
            pageStyle = `
                @page {
                    size: A4 portrait;
                    margin: 2cm;
                }
            `;
        }
        // 6. Montar o HTML completo para a nova janela, considerando a duplicação
        let printContent = '';
        if (isDuplicateEnabled) {
            // Se a duplicação estiver ativa, cria a estrutura com duas colunas
            const singleRecipeHTML = printOutputElement.innerHTML;
            printContent = `<div class="duplicate-container">${singleRecipeHTML}${singleRecipeHTML}</div>`;
        } else {
            // Senão, usa o conteúdo normal
            printContent = printOutputElement.innerHTML;
        }
        printOutputElement.style.display = 'none'; // Esconde de volta após capturar o conteúdo

        const printCSS = document.querySelector('link[href="print.css"]').outerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Receituário para Impressão</title>
                <style>${pageStyle}</style> <!-- Injeta a regra @page dinâmica -->
                ${printCSS}
            </head>
            <body class="${isDuplicateEnabled ? 'landscape-mode' : ''}">
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

    // Função para alternar o estado da duplicação (ON/OFF)
    function toggleDuplicate() {
        isDuplicateEnabled = !isDuplicateEnabled;
        duplicateBtn.classList.toggle('active');
    }

    // Adiciona os ouvintes de eventos
    addDateBtn.addEventListener('click', toggleDate); // O botão agora chama a função de alternância
    generateBtn.addEventListener('click', generateDocument);
    patientNameInput.addEventListener('input', checkCharLimit);
    duplicateBtn.addEventListener('click', toggleDuplicate);

    // Adiciona evento para filtrar a entrada do campo Prontuário
    patientIdInput.addEventListener('input', () => {
        // Remove qualquer caractere que NÃO seja um número, hífen ou barra
        patientIdInput.value = patientIdInput.value.replace(/[^0-9\/-]/g, '');
    });

    // Adiciona evento para permitir o uso da tecla TAB dentro do textarea
    reportTextInput.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && !e.shiftKey) {
            // 1. Previne o comportamento padrão (mudar de campo)
            e.preventDefault();
            
            // 2. Usa o comando 'insertText' para inserir uma tabulação.
            // Esta é uma abordagem mais confiável que 'insertHTML' ou manipulação de Range para este caso.
            document.execCommand('insertText', false, '\t');
        }
    });

    // Adiciona o evento de clique ao novo botão de reset
    resetBtn.addEventListener('click', () => {
        location.reload(); // Recarrega a página, limpando todos os campos
    });

    // Adiciona eventos para os botões de formatação
    boldBtn.addEventListener('click', () => {
        document.execCommand('bold', false, null);
    });

    italicBtn.addEventListener('click', () => {
        document.execCommand('italic', false, null);
    });

    underlineBtn.addEventListener('click', () => {
        document.execCommand('underline', false, null);
    });

    ulBtn.addEventListener('click', () => {
        // Comando para lista não ordenada
        document.execCommand('insertUnorderedList', false, null);
    });

    olBtn.addEventListener('click', () => {
        // Comando para lista ordenada
        document.execCommand('insertOrderedList', false, null);
    });
});