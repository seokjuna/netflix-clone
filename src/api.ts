const API_KEY = "42b1dc84b3aff38d2a29e1a4f1bc2112";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie { // IGetMoviesResult의 results
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    vote_average: number;
    release_date: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimun: string;
    };
    page: number;
		results: IMovie[]; // IMovie의 배열
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`)
        .then((response) => response.json()
    );
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`)
        .then((response) => response.json()
    );
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`)
        .then((response) => response.json()
    );
}

interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    vote_average: number;
    first_air_date: string;
}

export interface IGetTvShow {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export function getTvShow() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko`)
        .then((response) => response.json()
    );
}