const API_KEY = "42b1dc84b3aff38d2a29e1a4f1bc2112";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
        .then((response) => response.json()
    );
}