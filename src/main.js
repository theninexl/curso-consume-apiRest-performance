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

//lazyLoader necesita dos argumentos: callback(función) y options, y en options especificar el root que estás observando, en este caso no enviamos opciones porque vamos a observar el total del documento html (debería haber un pequeño observer por cada contenedor que necesites observar, no el total del documento.)
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry)=>{
        //console.log(entry)
        const url = entry.target.getAttribute('data-src');
        if (entry.isIntersecting === true) {
            entry.target.setAttribute('src',url);
        }
        
    });
});

const createMovies = (
    movies, 
    container, 
    { 
        lazyLoad = false, 
        clean = true 
    } = {},
    ) =>{
    if (clean) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click',() => {
            location.hash = `#movie=${movie.id}`;
        });
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-src' : 'src',
            `https://image.tmdb.org/t/p/w300/${movie.poster_path}
        `);
        movieImg.addEventListener('error',() =>{
            movieImg.setAttribute('src', 'https://img.freepik.com/vector-gratis/pagina-error-404-distorsion_23-2148105404.jpg?w=996&t=st=1681841588~exp=1681842188~hmac=8a00549fc481b001f1db153d657e0a0357a4ea3745a0d1d2166a9819cb47c634')
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

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
    maxPages = data.total_pages;
    createMovies(movies,genericSection,{lazyLoad:true, clean:true});
}

const getMoviesByCategoryPaginated = (id) => {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPages;
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie',{
                params:{
                    with_genres: id,
                    page
                }
            });
            const movies = data.results;
            console.log(data);
            createMovies(movies,genericSection,{lazyLoad:true, clean:false});
        } 
    }
}

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie',{
        params:{
            query: query,
        }
    });
    const movies = data.results;
    maxPages = data.total_pages;
    createMovies(movies,genericSection, {lazyLoad:true, clean:true});

    //const btnLoadMore = document.createElement('button');
    //btnLoadMore.innerText = 'Cargar más';
    //btnLoadMore.addEventListener('click', getMoviesBySearchPaginated);
    //genericSection.appendChild(btnLoadMore);
}

//esta función no es asíncrona porque al llamarse desde navigation usando el parametro entre paréntesis en realidad la estás ejecutando, en vez de asignarla al evento de infiniteScroll. Con lo que solo la llamas una sola vez, y no puede calcular todo el rato el scroll, y si se acerca al final, etc, y hacer el consecuente llamado, etc
//al dejar esta función como normal pero meterle dentro del return otra función lo que estás haciendo es un "closure": devolver como resultado de una función otra función, porque ahora si infiniteScroll si que recibe como resultado la necesidad de ejecutar todo el rato la segunda función.
//para comprobarlo basta con descomentar todos los console.log y poner la primera función como asíncrona. 

const getMoviesBySearchPaginated = (query) => {
    //console.log("search paginated 1");
    //const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    //console.log("scrolltop:"+scrollTop);
    //console.log("scrollisBottom:"+scrollIsBottom);
    return async function () {
        //console.log("search paginated 2");
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

        const pageIsNotMax = page < maxPages;

        if (scrollIsBottom && pageIsNotMax) {
            console.log("scroll is bottom");
            page++;
            const { data } = await api('search/movie',{
                params:{
                    query,
                    page,
                }
            });
            const movies = data.results;
            createMovies(movies,genericSection,{lazyLoad:true, clean:false});
        } 
    }
}

const getTrendingMovies = async () => {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(movies,genericSection, {lazyLoad:true, clean:true});
    maxPages = data.total_pages;

    //const btnLoadMore = document.createElement('button');
    //btnLoadMore.innerText = 'Cargar más';
    //btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    //genericSection.appendChild(btnLoadMore);
}

const getPaginatedTrendingMovies = async () => {
    console.log("paginated");
    //nos guardamos las propiedades que necesitamos de document.documentElement
    //scrollTop: la cantidad de scroll que hemos hecho
    //scorllHeight: la cantidad total de scroll posible en el documento
    //clientHeight: la altura de la ventana
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //creamos una constante que nos diga si hemos alcanzado el final del scroll posible. El -15 es para asegurarlo aunque estés a 15px de alcanzarlo.
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPages;

    if (scrollIsBottom && pageIsNotMax) {
        console.log("scroll is bottom");
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page: page,
            },
        });
        const movies = data.results;
        createMovies(movies,genericSection,{lazyLoad:true, clean:false});
        //const btnLoadMore = document.createElement('button');
        //btnLoadMore.innerText = 'Cargar más';
        //btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
        //genericSection.appendChild(btnLoadMore);
    }    
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


