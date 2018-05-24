

cierzoApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/login", {
        templateUrl : "tmpl/login.html",
        controller: 'loginController'
    })
    .when("/admin", {
        templateUrl : "admin.html",
        controller: 'adminController'
    })
    .when("/user", {
        templateUrl : "tmpl/user.html",
        controller: 'userController'
    })
    .when("/users", {
        templateUrl : "tmpl/users.html",
        controller: 'usersController'
    })
    .when("/user/:param", {
        templateUrl : "tmpl/user.html",
        controller: 'userController'
    })
    .when("/sign", {
        templateUrl : "tmpl/signup.html",
        controller: 'signController'
    })
    .when("/artists", {
        templateUrl : "tmpl/artists.html",
        controller: 'artistsController'
    })
    .when("/songs", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/songs/:param1", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/songs/:param1/:param2", {
        templateUrl : "tmpl/songs.html",
        controller: 'songsController'
    })
    .when("/albums", {
        templateUrl : "tmpl/albums.html",
        controller: 'albumsController'
    })
    .when("/albums/:param1", {
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