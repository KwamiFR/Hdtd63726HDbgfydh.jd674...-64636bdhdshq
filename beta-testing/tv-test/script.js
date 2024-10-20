document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const buttons = document.querySelectorAll('.nav-button');

    const updateActiveButton = () => {
        buttons.forEach((button, index) => {
            button.classList.toggle('active', index === currentIndex);
        });
    };

    const handleKeyDown = (event) => {
        switch(event.key) {
            case 'ArrowUp':
                if (currentIndex > 0) {
                    currentIndex--;
                }
                break;
            case 'ArrowDown':
                if (currentIndex < buttons.length - 1) {
                    currentIndex++;
                }
                break;
            case 'Enter':
                // Simule le clic sur le bouton actif
                alert(`Vous avez sélectionné : ${buttons[currentIndex].textContent}`);
                break;
        }
        updateActiveButton();
    };

    document.addEventListener('keydown', handleKeyDown);
    updateActiveButton(); // Pour initialiser l'animation sur le premier bouton
});
