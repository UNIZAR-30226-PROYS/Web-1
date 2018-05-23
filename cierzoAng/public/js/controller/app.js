var server='http://192.168.44.128:8080/api/';

cierzoApp.controller("principalController", ['$scope','$location', function ($scope,$location) {
    $scope.headerSrc = "tmpl/navbar.html";

    $scope.$on('$locationChangeSuccess', function(event){
        if($location.url()=='/login' || $location.url()=='/' || $location.url()=='/sign' ){
            $scope.repro=true;
        }
        else{
            $scope.repro=false;
        }
    })
}]);

var canciones=[];

cierzoApp.controller("songsController", ['$scope', '$routeParams','$http','music', function($scope, $routeParams,$http,music) {
    $scope.headerSrc = "tmpl/navbar.html";

    var lis=''
    var param = $routeParams.param1;
    if(param==undefined){
        $scope.titulo='Todas';
        var url2=server+'songs';
    }
    else{
        var url2=server+'playlists/'+param;
    }


    $http({
        method: 'GET',
        url: url2
    }).then(function successCallback(response) {
        
        if(param==undefined){
            //console.log(response.data);
            canciones=response.data;
            $scope.titulo='Lista: Todas';

        }
        else{
            var lis=response.data;

            $scope.titulo='Lista: '+lis.name;
            canciones=lis.songs;
            
        }
    
        for(var i=0;i<canciones.length;i++){
            canciones[i]["position"]=i;
        }

        $scope.canciones=canciones;

        /*
        //reproducir cancion desde /songs
        //hacer llamada con num=id cancion y reproducir en funcion de la posicion.  
        $scope.prueba2 = function(num) {
            var url3=server+'songs/'+num;
            $http({
                method: 'GET',
                url: url3
            }).then(function successCallback(response) {
                console.log('Exito cargar cancion');
                console.log(num);

                song = response.data;
                song["art"]=url3+'/image';
                audio.src = url3+'/file';
                songs=canciones;
                wList.textContent = 'Lista: '+ param;
                
                audio.onloadeddata = function() {
                    actualizarInfoWeb();
                    actualizarInfoMovil();
                } 
            }, function errorCallback(response) {
                console.log('Fracaso');
            });
        }*/


    }, function errorCallback(response) {
        console.log('Fracaso');
    });

    console.log("songs");
}]);

cierzoApp.controller("artistsController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'authors?limit=20'
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

    $http({
        method: 'GET',
        url: server+'albums?limit=20'
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
    console.log("genres");
}]);

cierzoApp.controller("listasRepController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'playlists?limit=20'
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
}]);



cierzoApp.controller("loginController",['$scope','$cookieStore', 'authProvider', '$location', function ($scope,$cookieStore,authProvider,$location) {
    console.log("login");
    $scope.loginn = function() {


        if($scope.nick2!=undefined && $scope.pass2!=undefined){
            
            if($scope.nick2=='root' && $scope.pass2=='toor' ){
                console.log("va");
                authProvider.setUser(true);
                $location.path('/songs');
                $cookieStore.put("conectado", true);
                $cookieStore.put("id", 'id'+$scope.nick2);
            }

        }
    }




}]);

cierzoApp.controller("signController",['$scope', function ($scope) {
    console.log("sign");
}]);



