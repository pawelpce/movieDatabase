(function(document){
    
    var page;
    var allResults;
    var query;
    
    var searchResultDiv = document.getElementById("searchResult");
    var noResultDiv = document.getElementById("noResult");
    var loaderDiv = document.getElementById("loader");
    var detailsLoaderDiv = document.getElementById("detailsLoader");
    var nextResultLoaderDiv = document.getElementById("nextResultLoader");
    var modalContainerDiv = document.getElementById("modal-container");
    var modalDiv = document.getElementById("modal");
    
    var closeIcon = '<i class="fa fa-close" style="font-size: 25px;"></i>';
    
    var xhttp = new XMLHttpRequest();
    
    var movieDatabaseUrl = 'http://www.omdbapi.com/?apikey=e20e9f33&#parameters#';
    var moviePattern = '<div class="movie-item" data-id="#id#"><div class="movie-item-image"><img src="#poster#"></div><br>#title#</div>';
    var movieDetailsPattern = '<h2>#title#</h2><img src="#poster#"><br><br><b>#plot#</b><br><br>Director: #director#<br>Actors: #actors#<br>' 
                                + '<br>Genre: #genre#<br>Runtime: #runtime#<br>Year: #year#<br>Language: #language#'
                                + '<br>Country: #country#<br>Awards: #awards#<br>IMDB Rating: #imdbRating#'
    
    document.movieForm.onsubmit = function(e) {
        e.preventDefault();
        clearLastResultsAndAddLoader();
        query = this.movieTitle.value;
        page = 1;
        var urlParams = "s=" + query + "&page=" + page;
        getResults(urlParams);
        this.reset();
    }
    
    nextResultLoaderDiv.onclick = function() {
        page++;
        var urlParams = "s=" + query + "&page=" + page;
        page*10 > allResults ? getNoMoreResultsTag() : getResults(urlParams);
    }
    
    document.addEventListener("click", function(e){
        for (var i = 0; i < e.path.length; i++){
            if (e.path[i].className.includes("movie-item")){
                showMovieDetails(e.path[i]);
            }
        }
    });
    
    document.addEventListener("click", function(e){
        if (e.srcElement.className == "fa fa-close" || e.srcElement.id == "modal-container") {
            modalContainerDiv.style.display = 'none';
            modalDiv.innerHTML = "";
        }        
    });
    
    function clearLastResultsAndAddLoader() {
        searchResultDiv.innerHTML = "";
        noResultDiv.innerHTML = "";
        loaderDiv.className = "loader";
    }
    
    function getResults(urlParams) {
        xhttp.onreadystatechange = readyFunction;
        xhttp.open("GET", movieDatabaseUrl.replace("#parameters#", urlParams), true);
        xhttp.send();
    }
    
    var readyFunction = function() {
        if (this.readyState == 4) {
            var response = this.responseText;
            var obj = JSON.parse(response);
            clearLoader();
            this.status == 200 ? generateResponse(obj) : getErrorTag();
        }    
    }
    
    function generateResponse(obj) {
        allResults = obj.totalResults;
        var display = page > 1 ? displayMoreResults : displayResults;
        var displayWay = obj.hasOwnProperty("Search") ? display : displaySingleMovieDetails;
        obj.Response == "False" ? getNoResultsTag() : displayWay(obj);
    }
    
    function getNoMoreResultsTag() {
        nextResultLoaderDiv.innerHTML = "No more results";
        nextResultLoaderDiv.style.color = "black";
        nextResultLoaderDiv.style.textDecoration = "none";
    }
    
    function displaySingleMovieDetails(obj) {
        modalDiv.innerHTML = closeIcon + movieDetailsPattern.replace("#poster#", obj.Poster).replace("#title#", obj.Title).replace("#runtime#", obj.Runtime)
                .replace("#year#", obj.Year).replace("#language#", obj.Language).replace("#country#", obj.Country).replace("#director#", obj.Director)
                .replace("#awards#", obj.Awards).replace("#plot#", obj.Plot).replace("#imdbRating#", obj.imdbRating).replace("#actors#", obj.Actors)
                .replace("#genre#", obj.Genre);
    }
    
    function displayResults(obj) {
        for (var i = 0; i < obj.Search.length; i++) {
           searchResultDiv.innerHTML += moviePattern.replace('#id#', obj.Search[i].imdbID).replace("#poster#", obj.Search[i].Poster)
               .replace('#title#', obj.Search[i].Title);
           }
        getMoreResultsTag();
    }
    
    function displayMoreResults(obj) {
        var moviesArray = obj.Search;
        var interval = 500;
        
        moviesArray.forEach(function(el, index){
            setTimeout(function() {
                searchResultDiv.innerHTML += moviePattern.replace('#id#', moviesArray[index].imdbID).replace("#poster#", moviesArray[index].Poster)
                .replace('#title#', moviesArray[index].Title).replace("movie-item", "movie-item animation");
            }, index * interval);
        })
    }
    
    function clearLoader() {
        loaderDiv.className = "";
        detailsLoaderDiv.className = "";
    }
    
    function getNoResultsTag() {
        noResultDiv.innerHTML = "<p style=\"text-align: center\">Sorry, there is no result. Try again later.</p>";
    }
    
    function getErrorTag() {
        noResultDiv.innerHTML = "<p style=\"text-align: center\">Sorry, something is wrong. Try again later.</p>";
    }
    
    function getMoreResultsTag() {
        nextResultLoaderDiv.innerHTML = "More results";
    }
    
    function showMovieDetails(movieItem) {
        modalContainerDiv.style.display = 'block';
        var urlParams = "i=" + movieItem.dataset.id;
        detailsLoaderDiv.className = "loader2";
        getResults(urlParams);
    }
    
})(document);