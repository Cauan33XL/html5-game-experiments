document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os elementos
    const gameCards = document.querySelectorAll('.game-card');
    const moveSound = document.getElementById('move-sound');
    const selectSound = document.getElementById('select-sound');
    
    let currentGameIndex = 0;
    let canNavigate = true; // Impede spam de teclas

    // Função para tocar sons
    function playSound(sound) {
        sound.currentTime = 0; // Reinicia o som
        sound.play();
    }

    // Função para atualizar a seleção visual
    function updateSelection() {
        gameCards.forEach((card, index) => {
            if (index === currentGameIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // Função para selecionar o jogo
    function selectGame() {
        if (!canNavigate) return; // Se já está selecionando, não faz nada
        canNavigate = false;

        const selectedCard = gameCards[currentGameIndex];
        const destination = selectedCard.dataset.href;

        // Toca som e adiciona animação
        playSound(selectSound);
        selectedCard.classList.add('selected');

        // Espera a animação de seleção (500ms) terminar antes de redirecionar
        setTimeout(() => {
            if (destination && destination !== "#") {
                window.location.href = destination;
            } else {
                console.warn(`Nenhuma URL de destino (data-href) definida para o cartão ${currentGameIndex}`);
                // Se não houver link, apenas reseta a navegação
                selectedCard.classList.remove('selected');
                canNavigate = true;
            }
        }, 500); 
    }

    // Função para lidar com o pressionamento de teclas
    function handleKeyDown(event) {
        if (!canNavigate) return; // Ignora input durante a seleção

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            event.preventDefault();
        }

        switch(event.key.toLowerCase()) {
            // Mover para a ESQUERDA
            case 'arrowleft':
            case 'a':
                currentGameIndex = (currentGameIndex > 0) ? currentGameIndex - 1 : gameCards.length - 1; // Dá a volta
                playSound(moveSound);
                break;
            
            // Mover para a DIREITA
            case 'arrowright':
            case 'd':
                currentGameIndex = (currentGameIndex < gameCards.length - 1) ? currentGameIndex + 1 : 0; // Dá a volta
                playSound(moveSound);
                break;
            
            // Ignora W e S
            case 'arrowup':
            case 'w':
            case 'arrowdown':
            case 's':
                break;
            
            // SELECIONAR (Enter ou Espaço)
            case 'enter':
            case ' ':
                selectGame();
                break;
        }

        // Atualiza a interface
        updateSelection();
    }

    // Adiciona "ouvintes" de eventos
    document.addEventListener('keydown', handleKeyDown);

    // Adiciona navegação por clique (bônus)
    gameCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentGameIndex) {
                currentGameIndex = index;
                updateSelection();
                playSound(moveSound);
            } else {
                selectGame();
            }
        });
    });


    // Inicia o menu selecionando o primeiro item
    updateSelection();
});