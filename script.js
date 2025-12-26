// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  
    // Exibe um alerta informando sobre a otimização para o Microsoft Edge
    alert("ATENÇÃO!!!!! Para garantir a melhor experiência e todas as funcionalidades, utilize o navegador MICROSOFT EDGE. Obrigado!");

    // Seleciona o campo de busca e todos os cartões de documentos
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const noResultsMessage = document.getElementById('no-results-message');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    // --- Lógica do Modal de Aviso (Injetado via JS para funcionar em todas as páginas) ---
    const createUpdateModal = () => {
        // Verifica se o modal já existe para não duplicar
        if (document.getElementById('updateModal')) return;

        // 1. Injeta o CSS do Modal
        const style = document.createElement('style');
        style.innerHTML = `
            .modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.7); display: none;
                justify-content: center; align-items: center; z-index: 9999;
                backdrop-filter: blur(3px);
            }
            .modal-content {
                background-color: #fff; padding: 30px; border-radius: 12px;
                max-width: 810px; width: 90%; text-align: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); position: relative;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                border-top: 6px solid #0056b3;
            }
            .close-btn {
                position: absolute; top: 10px; right: 15px; font-size: 24px;
                cursor: pointer; background: none; border: none; color: #555;
            }
            .modal-content h2 { color: #0056b3; margin-bottom: 15px; }
            .modal-content p { margin-bottom: 15px; line-height: 1.6; color: #333; }
            .countdown-container {
                background: #f8f9fa; padding: 15px; border-radius: 8px;
                margin: 20px 0; border: 1px solid #dee2e6;
            }
            #countdown { font-size: 1.5em; font-weight: bold; color: #d9534f; display: block; margin-top: 5px; }
            .btn-new-version {
                display: inline-block; background-color: #28a745; color: white;
                padding: 12px 25px; text-decoration: none; border-radius: 5px;
                font-weight: bold; transition: background-color 0.3s; margin-top: 10px;
            }
            .btn-new-version:hover { background-color: #218838; }
            .trial-notice { font-size: 0.9em; color: #666; margin-top: 15px; font-style: italic; }
        `;
        document.head.appendChild(style);

        // 2. Injeta o HTML do Modal
        const modalHTML = `
            <div class="modal-content">
                <button class="close-btn">&times;</button>
                <h2><i class="fa-solid fa-circle-info"></i> Atualização Importante</h2>
                <p>Prezados usuários, a <strong>Central de Documentos Médicos</strong> evoluiu para uma <strong>nova versão completa</strong>.</p>
                <p>A nova plataforma agora conta com <strong>banco de dados integrado, notas, salvamento de modelos com biblioteca particular, integração personalizada, histórico e maior segurança</strong>.</p>
                
                <div class="countdown-container">
                    <span>Esta versão legada será descontinuada em:</span>
                    <span id="countdown"></span>
                    <small style="display:block; margin-top:5px; color:#6c757d;">(31/12/2025 às 23:59)</small>
                </div>

                <a href="https://ambulatorio-hc-ufg.vercel.app" target="_blank" class="btn-new-version">
                    Acessar Nova Versão <i class="fa-solid fa-external-link-alt"></i>
                </a>
                
                <p class="trial-notice"><i class="fa-solid fa-star"></i> Aproveite o período de teste gratuito na nova plataforma até <strong>12/01/2026 (segunda-feira)</strong>! <i class="fa-solid fa-star"></i></p>
                <p class="trial-notice"><i class="fa-solid fa-star"></i> Inclusive, estamos com promoção para os planos Semestrais e Anuais. <strong>Revolucione sua Prática Médica!</strong> <i class="fa-solid fa-star"></i></p>
            </div>
        `;
        const modalDiv = document.createElement('div');
        modalDiv.id = 'updateModal';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        // 3. Lógica de Controle (Tempo e Contagem)
        const modal = document.getElementById('updateModal');
        const closeBtn = modal.querySelector('.close-btn');
        
        // Função para verificar se deve mostrar o modal (a cada 5 min)
        const checkShowModal = () => {
            const lastClosed = localStorage.getItem('updateModalLastClosed');
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;

            if (!lastClosed || (now - parseInt(lastClosed)) > fiveMinutes) {
                modal.style.display = 'flex';
            }
        };

        // Fechar modal e salvar o horário
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            localStorage.setItem('updateModalLastClosed', Date.now());
        };

        // Inicia verificação e configura intervalo
        checkShowModal();
        setInterval(checkShowModal, 10000); // Verifica a cada 10 segundos se já passou o tempo

        // Contagem Regressiva
        const countDownDate = new Date("2025-12-31T23:59:00").getTime();
        setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const el = document.getElementById("countdown");
            if(el) {
                el.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
                if (distance < 0) el.innerHTML = "SERVIÇO DESCONTINUADO";
            }
        }, 1000);
    };
    
    // Inicializa o modal
    createUpdateModal();

    // --- Lógica para automação do rodapé (Versão e Data) ---
    const setupFooter = () => {
        const appVersion = 'Alfa 1.4.1'; // Ponto central para atualizar a versão
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
    if (searchInput) {
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
    }

    // Adiciona um "ouvinte" para o clique no botão de limpar
    if (clearSearchBtn) {
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
    }

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
    if (background) {
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
    }

});