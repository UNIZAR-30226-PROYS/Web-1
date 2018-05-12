cierzoApp.controller("principalController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";
}]);

var canciones=[];

cierzoApp.controller("songsController", ['$scope', '$routeParams', function($scope, $routeParams) {
    $scope.headerSrc = "tmpl/navbar.html";


    var param = $routeParams.param1;
    if(param==undefined){
        param='canciones';
        $scope.titulo='Todas';
    }
    else{
        $scope.titulo='Lista: '+ param;
    }
    var dato='http://localhost:2595/'+param;

    //CONSULTA A LA API
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dato, false);
    xhr.send();
    //FIN CONSULTA
    
    canciones=JSON.parse(xhr.responseText);

    for(var i=0;i<canciones.length;i++){
        canciones[i]["position"]=i;
    }


    $scope.prueba = function(num) {
        song = canciones[num];
        audio.src = song.url;
        songs=canciones;
        wList.textContent = 'Lista: '+param;
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            actualizarInfoMovil();
        }
    }
    


    $scope.canciones=canciones;
    console.log("songs");
}]);

cierzoApp.controller("artistsController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";

    //CONSULTA A LA API
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:2595/artists', false);
    xhr.send();
    //FIN CONSULTA
    
    var artists=JSON.parse(xhr.responseText);

    $scope.artists=artists;





    console.log("artists");
}]);

cierzoApp.controller("albumsController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";

    //CONSULTA A LA API
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:2595/albums', false);
    xhr.send();
    //FIN CONSULTA
    
    var albums=JSON.parse(xhr.responseText);

    $scope.albums=albums;


    console.log("albums");
}]);

cierzoApp.controller("genresController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    console.log("genres");
}]);

cierzoApp.controller("listasRepController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:2595/lista", false);
    xhr.send();
    //FIN CONSULTA
    
    listas=JSON.parse(xhr.responseText);

    $scope.listas=listas;

}]);



cierzoApp.controller("peopleController",['$scope', function ( $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
}]);



