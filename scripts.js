document.addEventListener('DOMContentLoaded', (event) => {
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');

    loginBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
