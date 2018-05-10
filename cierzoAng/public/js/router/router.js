

cierzoApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/artists", {
        templateUrl : "tmpl/artists.html",
        controller: 'artistsController'
    })
    .when("/songs", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/albums", {
        templateUrl : "tmpl/albums.html",
        controller: 'albumsController'
    })
    .when("/genres", {
        templateUrl : "tmpl/genres.html",
        controller: 'genresController'
    })
    .when("/listasRep", {
        templateUrl : "tmpl/listas.html",
        controller: 'listasRepController'
    })
    .when("/people", {
        templateUrl : "tmpl/people.html",
        controller: 'peopleController'
    })
});