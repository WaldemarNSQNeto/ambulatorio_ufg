// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  
    // Exibe um alerta informando sobre a otimização para o Microsoft Edge
    alert("ATENÇÃO!!!!! Para garantir a melhor experiência e todas as funcionalidades, utilize o navegador MICROSOFT EDGE. Obrigado!");

    // Seleciona o campo de busca e todos os cartões de documentos
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const noResultsMessage = document.getElementById('no-results-message');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    // --- Lógica para automação do rodapé (Versão e Data) ---
    const setupFooter = () => {
        const appVersion = 'Alfa 1.4'; // Ponto central para atualizar a versão
        const versionInfoSpan = document.getElementById('version-info');

        if (versionInfoSpan) {
            // Pega a data da última modificação do documento
            const lastModifiedDate = new Date(document.lastModified);
            const day = String(lastModifiedDate.getDate()).padStart(2, '0');
            const month = String(lastModifiedDate.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
            const year = lastModifiedDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            versionInfoSpan.textContent = `V. ${appVersion} (${formattedDate})`;
        }
    };
    setupFooter();

    // Animação de entrada escalonada para os cartões
    cards.forEach((card, index) => {
        // Adiciona um atraso na animação de cada cartão
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Adiciona um "ouvinte" que reage a cada tecla digitada no campo de busca
    searchInput.addEventListener('keyup', (event) => {
        // Pega o texto digitado e converte para minúsculas para facilitar a comparação
        const searchTerm = event.target.value.toLowerCase();
        let resultsFound = 0;
    

        // Mostra ou esconde o botão de limpar
        if (searchTerm.length > 0) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }

        // Passa por cada cartão para decidir se ele deve ser mostrado ou escondido
        cards.forEach(card => {
            // Pega o título do cartão e também converte para minúsculas
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();

            // Verifica se o título do cartão inclui o texto da busca
            if (cardTitle.includes(searchTerm)) {
                card.style.display = 'flex'; // Se incluir, mostra o cartão
                resultsFound++;
            } else {
                card.style.display = 'none'; // Se não incluir, esconde o cartão
            }
        });

        // Mostra ou esconde a mensagem de "nenhum resultado"
        if (resultsFound === 0 && searchTerm.length > 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }
    });

    // Adiciona um "ouvinte" para o clique no botão de limpar
    clearSearchBtn.addEventListener('click', () => {
        // Limpa o valor do campo de busca
        searchInput.value = '';
        // Esconde o botão de limpar
        clearSearchBtn.classList.remove('visible');
        // Mostra todos os cartões novamente
        cards.forEach(card => {
            card.style.display = 'flex';
        });
        // Garante que a mensagem de "nenhum resultado" esteja escondida
        noResultsMessage.classList.add('hidden');
        // Coloca o foco de volta no campo de busca
        searchInput.focus();
    });

    // --- NOVO: Feedback visual (ripple) ao clicar nos cartões ---
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Previne o efeito em cliques que não sejam o botão esquerdo do mouse
            if (e.button !== 0) return;

            const rect = card.getBoundingClientRect();

            // Cria o elemento span que será a ondulação
            const ripple = document.createElement('span');
            
            // Define um tamanho fixo para a ondulação antes da animação de escala
            const size = 100; // em pixels
            ripple.style.width = ripple.style.height = `${size}px`;

            // Centraliza a ondulação no ponto do clique
            ripple.style.left = `${e.clientX - rect.left - (size / 2)}px`;
            ripple.style.top = `${e.clientY - rect.top - (size / 2)}px`;
            ripple.classList.add('ripple');

            // Adiciona a ondulação ao cartão e a remove após a animação
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600); // Duração deve ser a mesma da animação no CSS
        });
    });

    // --- NOVO: Lógica para criar ícones de fundo animados ---
    const background = document.getElementById('animated-background');
    // Adicionamos 'logo' como uma das opções a serem sorteadas
    //const icons = ['logo'];
    const icons = ['fa-stethoscope', 'fa-heart-pulse', 'fa-pills', 'fa-syringe', 'fa-dna', 'fa-microscope', 'fa-notes-medical', 'fa-band-aid', 'fa-x-ray', 'fa-tablets', 'fa-brain', 'fa-virus'];
    const numberOfIcons = 31; // Quantidade de ícones na tela

    for (let i = 0; i < numberOfIcons; i++) {
        const randomChoice = icons[Math.floor(Math.random() * icons.length)];
        let element;

        if (randomChoice === 'logo') {
            element = document.createElement('img');
            element.src = 'Asklépios - Receituário Simples/The-Rod-of-Asclepius2-V2.png';
            element.className = 'bg-icon'; // Usa a mesma classe de animação
        } else {
            element = document.createElement('i');
            element.className = `fa-solid ${randomChoice} bg-icon`;
            element.style.fontSize = `${Math.random() * 30 + 15}px`; // Tamanho entre 15px e 45px
        }
        
        // Propriedades comuns para todos os elementos
        element.style.left = `${Math.random() * 100}vw`;
        
        // Duração e atraso da animação aleatórios para um efeito mais natural
        const animationDuration = Math.random() * 20 + 15; // Duração entre 15s e 35s
        const animationDelay = Math.random() * 15; // Atraso de até 15s

        element.style.animation = `rise ${animationDuration}s linear ${animationDelay}s infinite`;

        background.appendChild(element);
    }

});