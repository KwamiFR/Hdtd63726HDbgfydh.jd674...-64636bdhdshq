const apiKeyTMDB = '6fbec6555f5ace1ddf25d358051c0a07'; // L'API CHANGE CHAQUE JOUR EST SERA BIENTÔT ENTIÈREMENT CRYPTÉ SUR UN SERVEUR VPS
const movieList = document.getElementById('movie-list');
const stvList = document.getElementById('stv-list');
const searchBar = document.getElementById('search-bar');
const modalMovie = document.getElementById('modal-movie');
const modalSTV = document.getElementById('modal-stv');
const movieInfo = document.getElementById('movie-info');
const stvInfo = document.getElementById('stv-info');
const stvembedContainer = document.getElementById('stv-embed-container');
const movieembedContainer = document.getElementById('movie-embed-container');
const seasonList = document.getElementById('season-list');
const episodeList = document.getElementById('episode-list');
let currentMovieId = null; // Variable pour stocker l'ID du film

// Fonction pour récupérer les films populaires depuis TMDB
async function fetchMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKeyTMDB}&language=fr-FR`);
    return response.json();
}

// Fonction pour récupérer les séries populaires depuis TMDB
async function fetchSeries() {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKeyTMDB}&language=fr-FR`);
    return response.json();
}

// Search movies and TV from TMDB
async function searchTMDB(query) {
    const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&language=fr-FR&query=${encodeURIComponent(query)}`);
    const stvResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKeyTMDB}&language=fr-FR&query=${encodeURIComponent(query)}`);

    const movies = await movieResponse.json();
    const stv = await stvResponse.json(); // Corrected here

    return { movies: movies.results, stv: stv.results }; // Corrected here
}

// Display content on the page
function displayContent(content, type) {
    const list = type === 'movie' ? movieList : stvList; // Removed series part
    list.innerHTML = ''; // Clear the list before displaying new items

    content.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="${item.title || item.name}" />
            <div class="card-title">${item.title || item.name}</div>
        `;
        // Assign the click event based on the type
        div.onclick = () => type === 'movie' ? showMovieInfo(item) : showSTVInfo(item); // Simplified here
        list.appendChild(div);
    });
}

// Show movie information in the modal
function showMovieInfo(item) {
    const posterUrl = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
    movieInfo.innerHTML = `
        <div class="info-container">
            <img src="${posterUrl}" alt="${item.title}" class="poster" />
            <div class="info-details">
                <h2>${item.title}</h2>
                <p>${item.overview || 'Aucune description disponible.'}</p>
            </div>
        </div>
    `;
    currentMovieId = item.imdb_id || item.id; // Stocker l'ID du film IMDB
    modalMovie.style.display = 'block';
}

// Watch the selected movie
function watchMovie() {
    const embedUrl = `https://vidsrc.icu/embed/movie/${currentMovieId}`; // Update with your movie stream source
    movieembedContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    movieembedContainer.style.display = 'block';
}

// Show STV information in the modal
async function showSTVInfo(item) {
    const posterUrl = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
    stvInfo.innerHTML = `
        <div class="info-container">
            <img src="${posterUrl}" alt="${item.name}" class="poster" />
            <div class="info-details">
                <h2>${item.name}</h2>
                <p>${item.overview || 'Aucune description disponible.'}</p>
                ${await loadSeasons(item.id)}
            </div>
        </div>
    `;
    modalSTV.style.display = 'block';
    
    // Load episodes for the first season
    await loadEpisodes(item.id, 1);
}

// Load seasons for STV shows
async function loadSeasons(tvId) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKeyTMDB}&language=fr-FR`);
    const tvDetails = await response.json();
    const seasons = tvDetails.seasons;

    let seasonHTML = '<h3>Saisons</h3>';
    seasonHTML += '<select id="season-select" onchange="loadEpisodesCombo(' + tvId + ')">';
    seasons.forEach(season => {
        seasonHTML += `<option value="${season.season_number}">${season.name} (S${season.season_number})</option>`;
    });
    seasonHTML += '</select>';

    return seasonHTML;
}

// Load episodes for the selected season
async function loadEpisodesCombo(tvId) {
    const seasonNumber = document.getElementById('season-select').value;
    await loadEpisodes(tvId, seasonNumber);
}

async function loadEpisodes(tvId, seasonNumber) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${apiKeyTMDB}&language=fr-FR`);
    const seasonDetails = await response.json();

    if (seasonDetails.episodes) {
        const episodes = seasonDetails.episodes;
        episodeList.innerHTML = '<h3>Episodes</h3>';

        episodes.forEach(episode => {
            const div = document.createElement('div');
            div.innerHTML = `<button class="episode-button" onclick="watchEpisode('${tvId}', ${seasonNumber}, ${episode.episode_number})">${episode.name} (Épisode ${episode.episode_number})</button>`;
            episodeList.appendChild(div);
        });
    } else {
        episodeList.innerHTML = '<p>Aucun épisode trouvé.</p>';
    }
}

// Watch the selected episode
function watchEpisode(tvId, seasonNumber, episodeNumber) {
    const embedUrl = `https://vidsrc.icu/embed/tv/${tvId}/${seasonNumber}/${episodeNumber}`; // Update with your TV episode stream source
    stvembedContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    stvembedContainer.style.display = 'block';
}

// Initialize and load content
async function init() {
    const popularMovies = await fetchMovies();
    const popularSeries = await fetchSeries();
    
    displayContent(popularMovies.results, 'movie');
    displayContent(popularSeries.results, 'stv'); // Correction ici
}

// Search functionality
searchBar.addEventListener('input', async () => {
    const query = searchBar.value.trim();
    if (query.length > 0) {
        const { movies, stv } = await searchTMDB(query); // Correction ici
        displayContent(movies, 'movie');
        displayContent(stv, 'stv');
    } else {
        init(); // Recharger le contenu initial si la recherche est vide
    }
});

// Close modals
modalMovie.querySelector('.close-movie').onclick = () => {
    modalMovie.style.display = 'none';
    movieembedContainer.innerHTML = ''; 
    movieembedContainer.style.display = 'none'; 
};

modalSTV.querySelector('.close-stv').onclick = () => {
    modalSTV.style.display = 'none';
    stvembedContainer.innerHTML = ''; 
    stvembedContainer.style.display = 'none'; 
};

// Initialize content on page load
init();
