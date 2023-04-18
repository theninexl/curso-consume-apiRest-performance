searchFormBtn.addEventListener('click', () =>{
    
    location.hash='#search='+searchFormInput.value;
})

trendingBtn.addEventListener('click', () =>{
    location.hash='#trends';
})

arrowBtn.addEventListener('click', () =>{
    //location.hash='#home';
    window.history.back();
})

const navigator = () => {
    console.log({location});

    const HASHES = {
        '#trends':() => trendsPage(),
        '#search=':() => searchPage(),
        '#movie=':() => movieDetailsPage(),
        '#category=':() => categoriesPage()
    };

    for (const KEY of Object.keys(HASHES)) {
        if (location.hash.startsWith(KEY)){
            HASHES[KEY]();
            return;
        }
    }
    homePage();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
}

   /*if (location.hash.startsWith('#trends')) {
    trendsPage();
   } else if (location.hash.startsWith('#search=')) {
    searchPage();
   }else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
   }else if (location.hash.startsWith('#category=')) {
    categoriesPage();
   }else {
    homePage();    
   }
}*/

const homePage = () => {
    console.log('home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getTrendingCategoriesPreview();
}

const categoriesPage = () => {
    console.log('Categories');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    //al declarar la variable desestructuramos sus datos creando directamente el array que queremos de _ (la categoría no la necesitamos para nada y categoryData (que lo vamos a usar para pillar el id y poder cargar las películas más recientes por categoría). El método split separa los datos según el caracter que tu le des, en diferentes arrays.)
    const [_,categoryData] = location.hash.split('='); // ['category','id-name']
    //repetimos la operación para desestructurar el contenido de categoryData en id y name por separado
    const [categoryId,categoryName] = categoryData.split('-');

    getMoviesByCategory(categoryId,categoryName);
}

const movieDetailsPage = () => {
    console.log('Movie details');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_,movieId] = location.hash.split('='); // ['#movie','movieID']
    getMovieById(movieId);
}

const searchPage = () => {
    console.log('Search');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_,query] = location.hash.split('='); // ['#search','searchValue']
    getMoviesBySearch(query);
}

const trendsPage = () => {
    console.log('Trends');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();
}

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
