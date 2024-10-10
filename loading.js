// Afficher le modal de chargement
document.addEventListener("DOMContentLoaded", function() {
    const loadingModal = document.getElementById("loading-modal");
    loadingModal.style.display = "flex"; // Afficher le modal

    // Simule le temps de chargement de 4 secondes
    setTimeout(() => {
        loadingModal.style.display = "none"; // Cacher le modal après 4 secondes
    }, 4000);
});
