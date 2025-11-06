// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  
    // Exibe um alerta informando sobre a otimização para o Microsoft Edge
    alert("Atenção: Este site foi desenvolvido e otimizado para o navegador Microsoft Edge, visando uma melhor integração com o sistema operacional Windows. Para garantir a melhor experiência e todas as funcionalidades, utilize o navegador MICROSOFT EDGE. Obrigado!");

    // Seleciona o campo de busca e todos os cartões de documentos
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    // Animação de entrada escalonada para os cartões
    cards.forEach((card, index) => {
        // Adiciona um atraso na animação de cada cartão
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Adiciona um "ouvinte" que reage a cada tecla digitada no campo de busca
    searchInput.addEventListener('keyup', (event) => {
        // Pega o texto digitado e converte para minúsculas para facilitar a comparação
        const searchTerm = event.target.value.toLowerCase();

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
            } else {
                card.style.display = 'none'; // Se não incluir, esconde o cartão
            }
        });
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
        // Coloca o foco de volta no campo de busca
        searchInput.focus();
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