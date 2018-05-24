var server='http://192.168.44.128:8080/api/';

cierzoApp.controller("principalController", ['$scope','$location','$cookieStore', function ($scope,$location,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.usuario=$cookieStore.get('nombre');

    $scope.$on('$locationChangeSuccess', function(event){
        if($location.url()=='/login' || $location.url()=='/' || $location.url()=='/sign' || $location.url()=='/admin' || $location.url()=='/user/*' || $location.url()=='/user' ){
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
            var lis=response.data;
            canciones=response.data;
            $scope.titulo='Lista: Todas';
            nLista='Todas';

        }
        else if(param=='album'){
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
            music.cambiarSongs(lista,nLista);
            music.playSongId(num);
        }


    }, function errorCallback(response) {
    });

}]);

cierzoApp.controller("artistsController", ['$scope','$http', function ($scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'authors?limit=20'
    }).then(function successCallback(response) {
        var artists=response.data;
        for(var i=0;i<artists.length;i++){
            artists[i]['imagen']=server+'authors/'+artists[i].id+'/image';
        }


        $scope.artists=artists;
    }, function errorCallback(response) {
    });

    $scope.artists=artists;

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

        if(param==undefined){
            var albums=response.data;
        }
        else{
            var albums=response.data.albums;
        }

        for(var i=0;i<albums.length;i++){
            albums[i]['imagen']=server+'albums/'+albums[i].id+'/image';
        }


        $scope.albums=albums;
    }, function errorCallback(response) {
    });

}]);

cierzoApp.controller("genresController", ['$scope', function ($scope) {
    $scope.headerSrc = "tmpl/navbar.html";

}]);

cierzoApp.controller("listasRepController", ['$scope','$http','$cookieStore', function ($scope,$http,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'profiles/'+$cookieStore.get('id')
    }).then(function successCallback(response) {

        var listas=response.data.playlists;

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

    });
    
}]);



cierzoApp.controller("usersController",['$scope','$http', function ( $scope,$http) {
    $scope.headerSrc = "tmpl/navbar.html";
    $http({
        method: 'GET',
        url: server+'profiles'
    }).then(function successCallback(response) {

        

        $scope.users=response.data;
    }, function errorCallback(response) {

    });

    $scope.add = function(id){
        alert("añado user "+id);
    }


}]);



cierzoApp.controller("loginController",['$scope','$cookieStore', 'authProvider', '$location','$http', function ($scope,$cookieStore,authProvider,$location,$http) {


    $scope.loginn = function() {
        if($scope.nick2!=undefined && $scope.pass2!=undefined){
            
            if($scope.nick2=='root' && $scope.pass2=='toor' ){

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
                    url: server+'login',
                    data: data2
                }).then(function successCallback(response) {

                    authProvider.setUser(true);
                    $cookieStore.put("conectado", true);
                    $cookieStore.put("nombre",$scope.nick2);
                    $cookieStore.put("id", response.data.id);
                    $location.path('/songs');
                    




                }, function errorCallback(response) {

                    alert("Te has equivocado ajja");
                });  

            }

        }
    }




}]);

cierzoApp.controller("signController",['$scope','$http','$location', function ($scope,$http,$location) {



    $scope.sign = function(){

        if($scope.pass1!=$scope.pass12){
            alert("Contraseñas distintas ajjaxd")
        }
        else{
            var data3={
                "mail": $scope.mail1,
                "name": $scope.name,
                "pass": $scope.pass1,
                "username": $scope.sur1
              }


            $http({
                method: 'POST',
                url: server+'signup',
                data: data3
            }).then(function successCallback(response) {
                alert("Te has registrado, ahora entra.");
                $location.path('/login');

               
            }, function errorCallback(response) {
                alert("Te has equivocado ajja");
            });
        }
    }
    

}]);




cierzoApp.controller("userController", ['$scope','$http','$cookieStore','authProvider','$location', function ($scope,$http,$cookieStore,authProvider,$location) {
    
    
    var finUrl=$cookieStore.get('id');
    $http({
        method: 'GET',
        url: server+'profiles/'+finUrl
    }).then(function successCallback(response) {
        $scope.user=response.data;

       
    }, function errorCallback(response) {
        
    });

    $scope.salir = function() {
        authProvider.setUser(false);
        $cookieStore.put("conectado", false);
        $cookieStore.remove("nombre");
        $cookieStore.remove("id");
        $location.path('/songs');
    }


    $scope.borrar = function() {
        /*
        authProvider.setUser(false);
        $cookieStore.put("conectado", false);
        $cookieStore.remove("nombre");
        $cookieStore.remove("id");

        $http({
            method: 'GET',
            url: server+'account'
        }).then(function successCallback(response) {
            console.log(response.data);
    
           
        }, function errorCallback(response) {
            
        });


        $location.path('/songs');
        */
       alert("Esto no va");
    }

}]);




cierzoApp.controller("adminController",['$scope','$http','$location', function ($scope,$http,$location) {


    /* SCRIPT que controla el panel de administrador */

    var enviarCancion   = document.getElementById('envioCancion'); //Boton enviarCancion
    var enviarAlbum     = document.getElementById('envioAlbum'); //Boton envioAlbum
    var modifTitulo     = document.getElementById('modTitulo'); //Boton mod Titulo
    var modifAlbum      = document.getElementById('modAlbum'); //Boton modificoAlbum
    var modifAutor      = document.getElementById('modArtista'); //Boton modificoAutor
    var eliminarCancion = document.getElementById('eliminarSong'); // Boton eliminarCancion
    var eliminarAlbum   = document.getElementById('eliminarAlbum'); // Boton eliminarAlbum
    var eliminarArtista = document.getElementById('eliminarAutor'); // Boton eliminarAutor


    /***************************************************************************/
    /********************* INSERTAR FICHEROS ***********************************/
    /***************************************************************************/

    /**
     * Cuando el boton enviarCancion es pulsado
     */
    enviarCancion.onclick = function () {
    var titulo  = document.getElementById("a_title").value;
    var artista = document.getElementById("a_artista").value;
    var album   = document.getElementById("a_album").value;
    var fichero_url = document.getElementById("a_file");
    var file = fichero_url.files[0];
    var formData = new FormData();
    formData.append('file',file);
    var fichero = document.getElementById("a_file").value;
    var genero  = document.getElementById("a_genero").value;
    console.log(fichero);
    // Subir cancion
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", server+"songs", false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({"albumID": album, "authorID": artista,
                                "genre": ["rock"], "lenght": "01:10","name": titulo}));

    if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Cancion añadida!');
        console.log("Añadida cancion--->");
        console.log("Titulo : " + titulo);
        console.log("Artista: " + artista);
        console.log("Album  : " + album);
        console.log("File   : " + fichero);

        //Subir fichero
        var cancion = JSON.parse(xmlhttp.responseText); //para obtener el id
        xmlhttp.open("POST", server+"songs/"+cancion.id+"/file", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(formData);

        //Limpio los campos
        document.getElementById("a_title").value = "";
        document.getElementById("a_artista").value = "";
        document.getElementById("a_album").value = "";
        document.getElementById("a_file").value = "";
        document.getElementById("a_file2").value = "";
        document.getElementById("a_genero").value = "";
    }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
    }

    }
    /**
     * Cuando el boton enviar2 es pulsado
     */
    enviarAlbum.onclick = function(){
    var titulo  = document.getElementById("al_title").value;
    var artista = document.getElementById("al_artista").value;
    var desc    = document.getElementById("al_desc").value;
    var publi   = document.getElementById("al_time").value;
    // Subir album
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", server+"albums", false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({"authorID": artista, "description": desc,
                                "name": titulo, "publishDate": publi+"T00:00:00.000Z"}));

    if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Album añadido!');
        console.log("Añadida album--->");
        console.log("Titulo : " + titulo);
        console.log("Artista: " + artista);
        console.log("Desc   : " + desc);
        console.log("public : " + publi);
        //Limpio los campos
        document.getElementById("al_title").value = "";
        document.getElementById("al_artista").value = "";
        document.getElementById("al_desc").value = "";
        document.getElementById("a_time").value = "";
    }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
    }
    }

    /***************************************************************************/
    /********************* MODIFICAR CANCION ***********************************/
    /***************************************************************************/

    /*
    * Boton modificar titulo pulsado
    */
    modifTitulo.onclick = function(){
    var titulo = document.getElementById("ca_title").value;
    var idSong = document.getElementById("ca_Idsong").value;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", server+"songs/"+idSong, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200){
        var cancion = JSON.parse(xmlhttp.responseText);
        var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
        var sec = function(){
        if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
            return "0" + Math.trunc(parseInt(cancion.lenght)%60);
        }else{
            return Math.trunc(parseInt(cancion.lenght)%60);
        }};
        xmlhttp.open("PUT", server+"songs/"+idSong, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"albumID":cancion.albumID.toString(),"albumName":cancion.albumName,"authorID":cancion.authorID.toString(),
                                    "authorName":cancion.authorName,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                    "name":titulo}));

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Info cambiada!');

        //Limpio los campos
        document.getElementById("ca_title").value = "";
        document.getElementById("ca_Idsong").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
    }else{
        alert('Algo ha ido mal...');
    }


    }

    /*
    * Boton modificar album pulsado
    */
    modifAlbum.onclick = function(){
    var albumID = document.getElementById("ca_album").value;
    var albumNa = document.getElementById("ca_albumna").value;
    var idSong = document.getElementById("ca_Idsong").value;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", server+"songs/"+idSong, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200){
        var cancion = JSON.parse(xmlhttp.responseText);
        var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
        var sec = function(){
        if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
            return "0" + Math.trunc(parseInt(cancion.lenght)%60);
        }else{
            return Math.trunc(parseInt(cancion.lenght)%60);
        }};
        xmlhttp.open("PUT", server+"songs/"+idSong, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"albumID":albumID.toString(),"albumName":albumNa,"authorID":cancion.authorID.toString(),
                                    "authorName":cancion.authorName,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                    "name":cancion.name}));

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Info cambiada!');

        //Limpio los campos
        document.getElementById("ca_album").value = "";
        document.getElementById("ca_albumna").value = "";
        document.getElementById("ca_Idsong").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
    }else{
        alert('Algo ha ido mal...');
    }
    }

    /*
    * Boton modificar autor pulsado
    */
    modifAutor.onclick = function(){
    var autorID = document.getElementById("ca_artist").value;
    var autorNa = document.getElementById("ca_artistna").value;
    var idSong = document.getElementById("ca_Idsong").value;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", server+"songs/"+idSong, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200){
        var cancion = JSON.parse(xmlhttp.responseText);
        var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
        var sec = function(){
        if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
            return "0" + Math.trunc(parseInt(cancion.lenght)%60);
        }else{
            return Math.trunc(parseInt(cancion.lenght)%60);
        }};
        xmlhttp.open("PUT", server+"songs/"+idSong, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"albumID":cancion.albumID.toString(),"albumName":cancion.albumName,"authorID":autorID.toString(),
                                    "authorName":autorNa,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                    "name":cancion.name}));

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Info cambiada!');

        //Limpio los campos
        document.getElementById("ca_artist").value = "";
        document.getElementById("ca_artistna").value = "";
        document.getElementById("ca_Idsong").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
    }else{
        alert('Algo ha ido mal...');
    }
    }


    /***************************************************************************/
    /********************* ELIMINAR FICHEROS ***********************************/
    /***************************************************************************/


    /**
     * Cuando el boton eliminarCancion es pulsado
     */
    eliminarCancion.onclick = function () {
    var idSong = document.getElementById("el_Idsong").value;
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("DELETE", server+"songs/"+idSong, false);
    xmlhttp.send();
    if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        xmlhttp.open("DELETE", server+"songs/"+idSong+"file", false);
        xmlhttp.send();

        alert('Cancion eliminada!');
        //Limpio los campos
        document.getElementById("el_Idsong").value = "";

    }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
    }
    }

    /**
     * Cuando el boton eliminarAlbum es pulsado
     */
    eliminarAlbum.onclick = function () {
        var idAlbum = document.getElementById("el_Idalbum").value;
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("DELETE", server+"albums/"+idAlbum, false);
        xmlhttp.send();
        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Album eliminado!');
        //Limpio los campos
        document.getElementById("el_Idalbum").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
    }

    /**
     * Cuando el boton eliminarAlbum es pulsado
     */
    eliminarArtista.onclick = function () {
    alert('No se puede eliminar artista..');
    document.getElementById("el_Idautor").value = "";
    }
  

}]);

