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
var nLista='';

cierzoApp.controller("songsController", ['$scope', '$routeParams','$http','music', function($scope, $routeParams,$http,music) {
    $scope.headerSrc = "tmpl/navbar.html";

    var lis=''
    var param = $routeParams.param1;
    if(param==undefined){
        $scope.titulo='Todas';
        var url2=server+'songs';
    }
    else if(param=='album'){
        var param2 = $routeParams.param2;
        var url2=server+'albums/'+param2;
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
            var lis=response.data;
            canciones=response.data;
            $scope.titulo='Lista: Todas';
            nLista='Todas';

        }
        else if(param=='album'){
            //console.log(response.data);
            var lis=response.data;
            canciones=lis.songs;
            
            nLista=lis.name;
            $scope.titulo='Album: '+nLista+' de '+lis.authorName;
        }
        else{
            var lis=response.data;

            nLista=lis.name;
            canciones=lis.songs;
            $scope.titulo='Lista: '+nLista;
            
        }

        $scope.canciones=canciones;

        
        //reproducir cancion desde /songs
        //hacer llamada con num=id cancion y reproducir en funcion de la posicion.  
        $scope.prueba = function(num,lista) {
            console.log(lista);
            music.cambiarSongs(lista,nLista);
            music.playSongId(num);
        }


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
        for(var i=0;i<artists.length;i++){
            artists[i]['imagen']=server+'authors/'+artists[i].id+'/image';
        }


        $scope.artists=artists;
    }, function errorCallback(response) {
        console.log('Fracaso');
    });

    $scope.artists=artists;

    console.log("artists");
}]);

cierzoApp.controller("albumsController", ['$scope','$http','$routeParams', function ($scope,$http,$routeParams) {
    $scope.headerSrc = "tmpl/navbar.html";



    var param = $routeParams.param1;
    if(param==undefined){
        $scope.titulo='Todas';
        var urlb=server+'albums?limit=20';
    }
    else{
        var urlb=server+'authors/'+param;
    }

    $http({
        method: 'GET',
        url: urlb
    }).then(function successCallback(response) {
        console.log('Exito');

        if(param==undefined){
            var albums=response.data;
        }
        else{
            console.log(response.data);
            var albums=response.data.albums;
        }

        for(var i=0;i<albums.length;i++){
            albums[i]['imagen']=server+'albums/'+albums[i].id+'/image';
        }


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
        var listas=response.data;

        for(var i=0;i<listas.length;i++){
            if(listas[i].songs.length==0){
                listas[i]['imagen']='http://www.popelera.net/wp-content/uploads/2016/10/melendi-quitate-las-gafas.jpg';
            }
            else{
                listas[i]['imagen']=server+'songs/'+listas[i].songs[0].id+'/image';
            }
           
        }

        $scope.listas=listas;
    }, function errorCallback(response) {
        console.log('Fracaso');
    });
    
}]);



cierzoApp.controller("peopleController",['$scope', function ( $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
}]);



cierzoApp.controller("loginController",['$scope','$cookieStore', 'authProvider', '$location','$http', function ($scope,$cookieStore,authProvider,$location,$http) {
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
            else{

                var data2={
                    "mail": $scope.nick2,
                    "pass": $scope.pass2
                  }



                $http({
                    method: 'POST',
                    url: 'http://192.168.44.128:8080/api/login',
                    data: data2
                }).then(function successCallback(response) {
                    console.log('entro');
                    authProvider.setUser(true);
                    $cookieStore.put("conectado", true);
                    $cookieStore.put("nombre", 'id'+$scope.nick2);
                    $cookieStore.put("id", response.data.id);
                    $location.path('/songs');
                }, function errorCallback(response) {
                    console.log('no entrooo');
                    alert("Te has equivocado ajja");
                });  

            }

        }
    }




}]);

cierzoApp.controller("signController",['$scope', function ($scope) {
    console.log("sign");
}]);



