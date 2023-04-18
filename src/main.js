//import { API_KEY } from "./secrets.js";
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
});

//helpers(utils)

const createMovies = (movies, container) =>{
    container.innerHTML = '';

    movies.forEach(movie => {        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click',() => {
            location.hash = `#movie=${movie.id}`;
        });
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src',`https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    })
}

const createCategories = (categories, container) => {

    container.innerHTML = "";

    categories.forEach(category => {
        const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list');
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id',`id${category.id}`);
        categoryTitle.addEventListener('click',()=>{
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    })

}



//llamadas a la api

const getTrendingMoviesPreview = async () => {
    //con fetch
    //const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+API_KEY);
    //const data = await res.json();
    //con axios
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    //console.log(movies);
    createMovies(movies,trendingMoviesPreviewList);
}

const getTrendingCategoriesPreview = async () => {
    //con fetch
    //const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key='+API_KEY);
    //const data = await res.json();

    //con axios
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

   createCategories(categories,categoriesPreviewList);
}

const getMoviesByCategory = async (id,name) => {
    headerCategoryTitle.innerHTML = name;
    const { data } = await api('discover/movie',{
        params:{
            with_genres: id,
        }
    });
    const movies = data.results;       
    createMovies(movies,genericSection);
}

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie',{
        params:{
            query: query,
        }
    });
    const movies = data.results;       
    createMovies(movies,genericSection);
}

const getTrendingMovies = async () => {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies,genericSection);
}

const getMovieById = async (id) => {
    const { data: movie } = await api(`movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
    ),
    url(
        ${movieImgUrl}
        )
    `;

    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent =  movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(id);
}

const getRelatedMoviesById = async (id) => {
    console.log('idpeli:'+id);
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;

    console.log(relatedMovies);

    createMovies(relatedMovies, relatedMoviesContainer);
}


