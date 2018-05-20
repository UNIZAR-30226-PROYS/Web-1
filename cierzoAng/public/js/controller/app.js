cierzoApp.controller("principalController", ['$scope','$location', function ($scope,$location) {
    $scope.headerSrc = "tmpl/navbar.html";

    

   $scope.$on('$locationChangeSuccess', function(event){
        console.log($location.url());
        if($location.url()=='/login' || $location.url()=='/' || $location.url()=='/sign' ){
            $scope.repro=true;
            //console.log($location.url());
        }
        else{
            $scope.repro=false;
            //console.log($location.url());
        }
    })


}]);

var canciones=[];

cierzoApp.controller("songsController", ['$scope', '$routeParams','$http', function($scope, $routeParams,$http) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;

    var lis=''
    var param = $routeParams.param1;
    if(param==undefined){
        param='canciones';
        $scope.titulo='Todas';
        var url2='http://192.168.56.101:8080/api/playlists/4';
    }
    else{
        var url2='http://192.168.56.101:8080/api/playlists/'+param;
    }


    $http({
        method: 'GET',
        url: url2
    }).then(function successCallback(response) {
        var lis=response.data;

        $scope.titulo='Lista: '+lis.name;
        canciones=lis.songs;
        for(var i=0;i<canciones.length;i++){
            canciones[i]["position"]=i;
        }

        $scope.canciones=canciones;


        $scope.prueba = function(num) {
            //hacer llamada con num=id cancion y reproducir en funcion de la posicion.
            
            var url3='http://192.168.56.101:8080/api/songs/'+num;
            $http({
                method: 'GET',
                url: url3
            }).then(function successCallback(response) {
                console.log('Exito cargar cancion');
                console.log(response.data.name);
        
            }, function errorCallback(response) {
                console.log('Fracaso');
            });
    
            //Antiguo uso
            /*
            song = canciones[num];
            audio.src = song.url;
            songs=canciones;
            wList.textContent = 'Lista: '+param;
            audio.onloadeddata = function() {
                actualizarInfoWeb();
                actualizarInfoMovil();
            }*/
        }


    }, function errorCallback(response) {
        console.log('Fracaso');
    });

    console.log("songs");
}]);

cierzoApp.controller("artistsController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;

    $http({
        method: 'GET',
        url: 'http://192.168.56.101:8080/api/authors?name='
    }).then(function successCallback(response) {
        console.log('Exito');
        var artists=response.data;
        $scope.artists=artists;
    }, function errorCallback(response) {
        console.log('Fracaso');
    });

    $scope.artists=artists;

    console.log("artists");
}]);

cierzoApp.controller("albumsController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;

    $http({
        method: 'GET',
        url: 'http://192.168.56.101:8080/api/albums?name='
    }).then(function successCallback(response) {
        console.log('Exito');
        var albums=response.data;
        $scope.albums=albums;
    }, function errorCallback(response) {
        console.log('Fracaso');
    });

    console.log("albums");
}]);

cierzoApp.controller("genresController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;
    console.log("genres");
}]);

cierzoApp.controller("listasRepController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;

    $http({
        method: 'GET',
        url: 'http://192.168.56.101:8080/api/playlists?name='
    }).then(function successCallback(response) {
        console.log('Exito');
        var artists=response.data;
        $scope.listas=artists;
    }, function errorCallback(response) {
        console.log('Fracaso');
    });
    
}]);



cierzoApp.controller("peopleController",['$scope', function ( $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.repro=false;
}]);



cierzoApp.controller("loginController",['$scope', function ($scope) {
    console.log("login");
    $scope.repro=true;
}]);

cierzoApp.controller("signController",['$scope', function ($scope) {
    console.log("sign");
}]);



